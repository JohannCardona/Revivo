import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv(
    r"\Revivo\backend\preprocessing\processed\dair-ai-emotion.csv", index_col=False)
print(df)
print(df["label"].value_counts())


plt.figure(figsize=(20, 8))
plt.rcParams.update({'font.size': 18})
df["label"].value_counts().plot(kind="bar", title="Emotion label distribution")
plt.ylabel("Frequency")
plt.xlabel("Emotion label")
plt.legend()
plt.show()

df1 = pd.read_csv(
    r"\Revivo\backend\preprocessing\processed\dair-ai-emotion.csv", index_col=False)
print("DAIR EMOTION: \n", df1["label"].value_counts())
