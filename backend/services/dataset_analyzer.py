import pandas as pd


def normalize_column_name(text):

    return (
        text.lower()
        .replace("_", "")
        .replace(" ", "")
        .replace("?", "")
        .strip()
    )


def analyze_question(df, question):

    user_question = question.lower().strip()

    # BASIC

    if "rows" in user_question:
        return f"The dataset contains {len(df)} rows."

    if "columns" in user_question:
        return f"The dataset contains {len(df.columns)} columns."

    if "missing" in user_question:
        return (
            f"The dataset contains "
            f"{int(df.isnull().sum().sum())} missing values."
        )

    if "summary" in user_question:
        return (
            f"The dataset contains "
            f"{len(df)} rows and "
            f"{len(df.columns)} columns."
        )

    # MOST COMMON

    if "most common" in user_question:

        categorical_columns = (
            df.select_dtypes(
                exclude="number"
            ).columns
        )

        if len(categorical_columns) > 0:

            column = categorical_columns[0]

            value = (
                df[column]
                .mode()[0]
            )

            return (
                f"The most common value in "
                f"{column} is {value}."
            )

    # HIGHEST AVERAGE

    if "highest average" in user_question:

        numeric_columns = (
            df.select_dtypes(
                include="number"
            ).columns
        )

        if len(numeric_columns) > 0:

            largest_column = (
                df[numeric_columns]
                .mean()
                .idxmax()
            )

            largest_value = round(
                df[largest_column].mean(),
                2
            )

            return (
                f"The highest average column is "
                f"{largest_column} ({largest_value})."
            )

    normalized_question = (
        user_question
        .replace("?", "")
        .replace("_", "")
    )

    for column in df.columns:

        normalized_column = (
            normalize_column_name(column)
        )

        # AVERAGE

        if "average" in user_question:

            requested = (
                normalized_question
                .replace("average of", "")
                .replace("average", "")
                .replace(" ", "")
            )

            if requested == normalized_column:

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    return (
                        f"Average of {column} is "
                        f"{round(df[column].mean(),2)}."
                    )

                return f"{column} is not numeric."

        # MAX

        if "max" in user_question:

            requested = (
                normalized_question
                .replace("max", "")
                .replace(" ", "")
            )

            if requested == normalized_column:

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    return (
                        f"Maximum value of {column} is "
                        f"{round(df[column].max(),2)}."
                    )

                return f"{column} is not numeric."

        # MIN

        if "min" in user_question:

            requested = (
                normalized_question
                .replace("min", "")
                .replace(" ", "")
            )

            if requested == normalized_column:

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    return (
                        f"Minimum value of {column} is "
                        f"{round(df[column].min(),2)}."
                    )

                return f"{column} is not numeric."

        # MEDIAN

        if "median" in user_question:

            requested = (
                normalized_question
                .replace("median", "")
                .replace(" ", "")
            )

            if requested == normalized_column:

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    return (
                        f"Median value of {column} is "
                        f"{round(df[column].median(),2)}."
                    )

                return f"{column} is not numeric."

        # SUM

        if "sum" in user_question:

            requested = (
                normalized_question
                .replace("sum", "")
                .replace(" ", "")
            )

            if requested == normalized_column:

                if pd.api.types.is_numeric_dtype(
                    df[column]
                ):

                    return (
                        f"Sum of {column} is "
                        f"{round(df[column].sum(),2)}."
                    )

                return f"{column} is not numeric."

    return "I don't understand the question yet."