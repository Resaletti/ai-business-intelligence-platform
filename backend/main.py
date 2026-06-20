from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import re
from services.dataset_analyzer import analyze_question
from fastapi.middleware.cors import CORSMiddleware
current_dataset = None
current_metrics = None

app = FastAPI(
    title="InsightAI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-business-intelligence-platform-two.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dashboard_data = {}

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "InsightAI Backend Running"
    }

@app.get("/dashboard")
def dashboard():
    return dashboard_data

@app.get("/columns")
def get_columns():

    global current_dataset

    if current_dataset is None:
        return {
            "columns": []
        }

    return {
        "columns": list(
            current_dataset.columns
        )
    }

@app.get("/dataset-profile")
def dataset_profile():

    global current_dataset

    if current_dataset is None:

        return {
            "rows": 0,
            "columns": 0,
            "numeric_columns": [],
            "categorical_columns": []
        }

    df = current_dataset

    numeric_columns = list(
        df.select_dtypes(
            include="number"
        ).columns
    )

    categorical_columns = list(
        df.select_dtypes(
            exclude="number"
        ).columns
    )

    return {
        "rows": len(df),
        "columns": len(df.columns),
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns
    }

@app.get("/column-profile/{column_name}")
def column_profile(column_name: str):

    global current_dataset

    if current_dataset is None:

        return {
            "error": "No dataset loaded"
        }

    df = current_dataset

    if column_name not in df.columns:

        return {
            "error": "Column not found"
        }

    column = df[column_name]

    missing = int(column.isnull().sum())

    if pd.api.types.is_numeric_dtype(column):

        return {
            "name": column_name,
            "type": "numeric",
            "count": int(column.count()),
            "missing": missing,
            "mean": round(float(column.mean()), 2),
            "median": round(float(column.median()), 2),
            "min": round(float(column.min()), 2),
            "max": round(float(column.max()), 2),
            "std": round(float(column.std()), 2)
        }

    return {
        "name": column_name,
        "type": "categorical",
        "count": int(column.count()),
        "missing": missing,
        "unique_values": int(column.nunique()),
        "most_common": str(column.mode()[0])
    }

@app.get("/data-quality")
def data_quality():

    global current_dataset

    if current_dataset is None:

        return {
            "rows": 0,
            "columns": 0,
            "duplicates": 0,
            "missing_values": 0,
            "completeness": 0,
            "column_quality": []
        }

    df = current_dataset

    rows = len(df)

    columns = len(df.columns)

    duplicates = int(
        df.duplicated().sum()
    )

    missing_values = int(
        df.isnull().sum().sum()
    )

    total_cells = rows * columns

    completeness = round(
        (
            (total_cells - missing_values)
            / total_cells
        ) * 100,
        2
    )

    column_quality = []

    for column in df.columns:

        column_quality.append({

            "column": column,

            "missing": int(
                df[column]
                .isnull()
                .sum()
            ),

            "unique": int(
                df[column]
                .nunique()
            )

        })

    return {

        "rows": rows,

        "columns": columns,

        "duplicates": duplicates,

        "missing_values": missing_values,

        "completeness": completeness,

        "column_quality": column_quality

    }

@app.get("/column-chart/{column_name}")
def column_chart(column_name: str):

    global current_dataset

    if current_dataset is None:

        return {
            "error": "No dataset loaded"
        }

    df = current_dataset

    if column_name not in df.columns:

        return {
            "error": "Column not found"
        }

    column = df[column_name]

    if pd.api.types.is_numeric_dtype(column):

        histogram = (
            column
            .dropna()
            .value_counts(
                bins=10,
                sort=False
            )
        )

        labels = [

    f"{round(interval.left)}-{round(interval.right)}"

    for interval in histogram.index

                ]

        values = [
            int(value)
            for value in histogram.values
        ]

        return {

            "type": "histogram",

            "column": column_name,

            "labels": labels,

            "values": values

        }

    counts = (
        column
        .astype(str)
        .value_counts()
        .head(10)
    )

    return {

        "type": "bar",

        "column": column_name,

        "labels": list(counts.index),

        "values": [
            int(v)
            for v in counts.values
        ]

    }

@app.get("/top-values/{column_name}")
def top_values(column_name: str):

    global current_dataset

    if current_dataset is None:

        return {
            "error": "No dataset loaded"
        }

    df = current_dataset

    if column_name not in df.columns:

        return {
            "error": "Column not found"
        }

    counts = (
        df[column_name]
        .astype(str)
        .value_counts()
        .head(10)
    )

    return {

        "column": column_name,

        "labels": list(
            counts.index
        ),

        "values": [

            int(v)

            for v in counts.values

        ]

    }

@app.get("/correlations")
def correlations():

    global current_dataset

    if current_dataset is None:

        return []

    df = current_dataset

    numeric_df = df.select_dtypes(
        include="number"
    )

    if len(numeric_df.columns) < 2:

        return []

    corr_matrix = numeric_df.corr()

    results = []

    columns = corr_matrix.columns

    for i in range(len(columns)):

        for j in range(i + 1, len(columns)):

            corr_value = round(
                float(
                    corr_matrix.iloc[i, j]
                ),
                4
            )

            strength = "Weak"

            if abs(corr_value) >= 0.7:

                strength = "Strong"

            elif abs(corr_value) >= 0.4:

                strength = "Moderate"

            results.append({

                "column_a": columns[i],

                "column_b": columns[j],

                "correlation": corr_value,

                "strength": strength

            })

    results = sorted(

        results,

        key=lambda x:
            abs(
                x["correlation"]
            ),

        reverse=True

    )

    return results[:10]

@app.get("/correlation-matrix")
def correlation_matrix():

    global current_dataset

    if current_dataset is None:

        return {
            "columns": [],
            "matrix": []
        }

    df = current_dataset

    numeric_df = df.select_dtypes(
        include="number"
    )

    if len(numeric_df.columns) < 2:

        return {
            "columns": [],
            "matrix": []
        }

    corr = numeric_df.corr()

    return {

        "columns":
            corr.columns.tolist(),

        "matrix":
            corr.round(3).values.tolist()

    }

@app.get("/outliers")
def outliers():

    global current_dataset

    if current_dataset is None:

        return []

    df = current_dataset

    results = []

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns

    for column in numeric_columns:

        series = df[column].dropna()

        q1 = series.quantile(0.25)

        q3 = series.quantile(0.75)

        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)

        upper = q3 + (1.5 * iqr)

        count = int(

            (
                (series < lower)
                |
                (series > upper)
            ).sum()

        )

        results.append({

            "column": column,

            "outliers": count

        })

    results.sort(

        key=lambda x: x["outliers"],

        reverse=True

    )

    return results

@app.get("/ai-insights")
def ai_insights():

    global current_dataset

    if current_dataset is None:

        return {
            "insights": []
        }

    df = current_dataset

    insights = []

    rows = len(df)

    cols = len(df.columns)

    insights.append(
        f"The dataset contains {rows} rows and {cols} columns."
    )

    missing = int(
        df.isnull().sum().sum()
    )

    if missing == 0:

        insights.append(
            "Dataset quality is excellent. No missing values were detected."
        )

    else:

        insights.append(
            f"The dataset contains {missing} missing values."
        )

    numeric_df = df.select_dtypes(
        include="number"
    )

    if len(numeric_df.columns) >= 2:

        corr = numeric_df.corr()

        best_corr = 0

        best_pair = None

        columns = corr.columns

        for i in range(len(columns)):

            for j in range(i + 1, len(columns)):

                value = abs(
                    corr.iloc[i, j]
                )

                if value > best_corr:

                    best_corr = value

                    best_pair = (
                        columns[i],
                        columns[j]
                    )

        if best_pair:

            insights.append(

                f"The strongest relationship found is between "
                f"{best_pair[0]} and {best_pair[1]} "
                f"(correlation {round(best_corr,4)})."

            )

    insights.append(
        "Analysis generated automatically from uploaded data."
    )

    return {
        "insights": insights
    }

@app.get("/dataset-health")
def dataset_health():

    global current_dataset

    if current_dataset is None:

        return {
            "score": 0,
            "status": "No Dataset"
        }

    df = current_dataset

    score = 100

    rows = len(df)

    columns = len(df.columns)

    missing_values = int(
        df.isnull().sum().sum()
    )

    duplicates = int(
        df.duplicated().sum()
    )

    completeness = round(

        (
            1 -
            (
                missing_values /
                (rows * columns)
            )
        ) * 100,

        2

    )

    score -= missing_values * 2

    score -= duplicates

    if rows < 100:

        score -= 10

    if columns < 3:

        score -= 10

    score = max(
        0,
        min(
            100,
            score
        )
    )

    status = "Poor"

    if score >= 90:

        status = "Excellent"

    elif score >= 75:

        status = "Good"

    elif score >= 50:

        status = "Fair"

    return {

        "score": score,

        "status": status,

        "rows": rows,

        "columns": columns,

        "duplicates": duplicates,

        "missing_values": missing_values,

        "completeness": completeness

    }

@app.get("/insights")
def insights():

    global current_dataset

    if current_dataset is None:
        return {
            "insights": [
                "No dataset uploaded yet."
            ]
        }

    df = current_dataset

    insights_list = []

    insights_list.append(
        f"Dataset contains {len(df)} rows."
    )

    insights_list.append(
        f"Dataset contains {len(df.columns)} columns."
    )

    numeric_columns = df.select_dtypes(include="number").columns

    insights_list.append(
        f"{len(numeric_columns)} numeric columns detected."
    )

    missing = int(df.isnull().sum().sum())

    if missing == 0:
        insights_list.append(
            "No missing values found."
        )
    else:
        insights_list.append(
            f"{missing} missing values detected."
        )

    # Insight numérico

    if len(numeric_columns) > 0:

        largest_mean_column = (
            df[numeric_columns]
            .mean()
            .idxmax()
        )

        largest_mean_value = round(
            df[largest_mean_column].mean(),
            2
        )

        insights_list.append(
            f"Highest average value found in '{largest_mean_column}' ({largest_mean_value})."
        )

    # Insight categórico

    categorical_columns = (
        df.select_dtypes(exclude="number")
        .columns
    )

    if len(categorical_columns) > 0:

        first_column = categorical_columns[0]

        top_category = (
            df[first_column]
            .mode()[0]
        )

        insights_list.append(
            f"Most frequent value in '{first_column}' is '{top_category}'."
        )

    return {
        "insights": insights_list
    }

@app.post("/ask")
def ask_data(question: dict):

    global current_dataset

    if current_dataset is None:
        return {
            "answer": "No dataset uploaded."
        }

    answer = analyze_question(
        current_dataset,
        question["question"]
    )

    return {
        "answer": answer
    }

    df = current_dataset

    user_question = question["question"].lower().strip()

    # ======================
    # BASIC QUESTIONS
    # ======================

    if "rows" in user_question:
        return {
            "answer": f"The dataset contains {len(df)} rows."
        }

    if "columns" in user_question:
        return {
            "answer": f"The dataset contains {len(df.columns)} columns."
        }

    if "missing" in user_question:
        return {
            "answer": f"The dataset contains {int(df.isnull().sum().sum())} missing values."
        }

    if "summary" in user_question:
        return {
            "answer": f"The dataset contains {len(df)} rows and {len(df.columns)} columns."
        }

    if "highest average" in user_question:

        numeric_columns = df.select_dtypes(include="number").columns

        if len(numeric_columns) > 0:

            largest_mean_column = (
                df[numeric_columns]
                .mean()
                .idxmax()
            )

            largest_mean_value = round(
                df[largest_mean_column].mean(),
                2
            )

            return {
                "answer":
                f"The highest average column is {largest_mean_column} ({largest_mean_value})."
            }

    if "most common" in user_question:

        categorical_columns = (
            df.select_dtypes(exclude="number")
            .columns
        )

        if len(categorical_columns) > 0:

            column = categorical_columns[0]

            value = (
                df[column]
                .mode()[0]
            )

            return {
                "answer":
                f"The most common value in {column} is {value}."
            }

    # ======================
    # DYNAMIC COLUMN SEARCH
    # ======================

    normalized_question = (
        user_question
        .replace("?", "")
        .replace("_", "")
    )

    for column in df.columns:

        normalized_column = (
            column.lower()
            .replace("_", "")
            .replace(" ", "")
        )

        # AVERAGE

        if "average" in user_question:

            requested_column = (
                normalized_question
                .replace("average of", "")
                .replace("average", "")
                .replace(" ", "")
                .strip()
            )

            if normalized_column == requested_column:

                if pd.api.types.is_numeric_dtype(df[column]):

                    return {
                        "answer":
                        f"Average of {column} is {round(df[column].mean(),2)}."
                    }

                return {
                    "answer":
                    f"{column} is not numeric."
                }

        # MAX

        if "max" in user_question:

            requested_column = (
                normalized_question
                .replace("max", "")
                .replace(" ", "")
                .strip()
            )

            if normalized_column == requested_column:

                if pd.api.types.is_numeric_dtype(df[column]):

                    return {
                        "answer":
                        f"Maximum value of {column} is {round(df[column].max(),2)}."
                    }

                return {
                    "answer":
                    f"{column} is not numeric."
                }

        # MIN

        if "min" in user_question:

            requested_column = (
                normalized_question
                .replace("min", "")
                .replace(" ", "")
                .strip()
            )

            if normalized_column == requested_column:

                if pd.api.types.is_numeric_dtype(df[column]):

                    return {
                        "answer":
                        f"Minimum value of {column} is {round(df[column].min(),2)}."
                    }

                return {
                    "answer":
                    f"{column} is not numeric."
                }

        # MEDIAN

        if "median" in user_question:

            requested_column = (
                normalized_question
                .replace("median", "")
                .replace(" ", "")
                .strip()
            )

            if normalized_column == requested_column:

                if pd.api.types.is_numeric_dtype(df[column]):

                    return {
                        "answer":
                        f"Median value of {column} is {round(df[column].median(),2)}."
                    }

                return {
                    "answer":
                    f"{column} is not numeric."
                }

        # SUM

        if "sum" in user_question:

            requested_column = (
                normalized_question
                .replace("sum", "")
                .replace(" ", "")
                .strip()
            )

            if normalized_column == requested_column:

                if pd.api.types.is_numeric_dtype(df[column]):

                    return {
                        "answer":
                        f"Sum of {column} is {round(df[column].sum(),2)}."
                    }

                return {
                    "answer":
                    f"{column} is not numeric."
                }

    return {
        "answer":
        "I don't understand the question yet."
    }

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):

    global current_dataset
    global dashboard_data

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    df = pd.read_csv(file_path)

    dataset_info = {
    "filename": file.filename,
    "rows": len(df),
    "columns": len(df.columns),
    "numeric_columns": len(
        df.select_dtypes(include="number").columns
    ),
    "categorical_columns": len(
        df.select_dtypes(exclude="number").columns
    ),
    "missing_values": int(
        df.isnull().sum().sum()
    ),
    "column_names": list(df.columns)
    }

    current_dataset = df

    dashboard_data = dataset_info

    return dataset_info