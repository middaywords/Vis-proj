import pandas as pd

# transform schedule.csv to psnSdl.csv

def transformCsv():
    file_name = "../frontend/static/schedule.csv"
    df = pd.read_csv(file_name,header=None)
    df_out = []
    for i, _ in enumerate(df.index):
        for j, _ in enumerate(df.columns):
            df_out.append({'grid': i, 'time': j, 'value': df.iat[i, j]})
    df_out = pd.DataFrame(df_out)
    out_file = "../frontend/static/psnSdl.csv"
    df_out.to_csv(out_file)


if __name__ == "__main__":
    transformCsv()
