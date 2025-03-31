import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv(
    r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\processed\dair-ai-emotion.csv", index_col=False)
print(df)
print(df["label"].value_counts())

plt.figure(figsize=(20,8))
df["label"].value_counts().plot(kind="bar", title="Emotion label distribution")
plt.ylabel("Frequency")
plt.xlabel("Emotion label")
plt.legend()
plt.show()

# df = pd.read_csv(r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\processed\go_emotions.csv", index_col=False)
# print("JOY: \n", df[df["joy"] == 1])
# print("SADNESS: \n", df[df["sadness"] == 1])
# print("LOVE: \n", df[df["love"] == 1])
# print("SURPRISE: \n", df[df["surprise"] == 1])
# print("FEAR: \n", df[df["fear"] == 1])
# print("EXCITEMENT: \n", df[df["excitement"] == 1])
# print("NERVOUSNESS: \n", df[df["nervousness"] == 1])
# print("REMORSE: \n", df[df["remorse"] == 1])
# print("GRIEF: \n", df[df["grief"] == 1])
# print("GRATITUDE: \n", df[df["gratitude"] == 1])
# print("EMBARRASSMENT: \n", df[df["embarrassment"] == 1])
# print("ADMIRATION: \n", df[df["admiration"] == 1])
# print("REALIZATION: \n", df[df["realization"] == 1])
# print(df.columns)
# print(df)

# df1 = pd.read_csv(
#     r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\processed\dair-ai-emotion.csv", index_col=False)
# print("DAIR EMOTION: \n", df1["label"].value_counts())

# df2 = pd.read_csv(
#     r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\processed\tweet_emotions.csv", index_col=False)
# print("TWEET EMOTION: \n", df2["label"].value_counts())

# df3 = pd.read_csv(
#     r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\emotion_datasets\eng_dataset.csv", index_col=False)
# print("ENG DATASET: \n", df3["sentiment"].value_counts())

# df4 = pd.read_csv(
#     r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\emotion_datasets\goemotions_test.csv", index_col=False)
# print("GOEMOTIONS TEST: \n")
# print("CONFUSION: \n", df4[df4["label"] == "6"])
# print("CURIOSITY: \n", df4[df4["label"] == "7"])
# print("ANNOYANCE: \n", df4[df4["label"] == "3"])
# print("DISSAPROVAL: \n", df4[df4["label"] == "10"])

# df5 = pd.read_csv(
#     r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\emotion_datasets\goemotions_dev.csv", index_col=False)
# print("GOEMOTIONS DEV: \n")
# print("CONFUSION: \n", df5[df5["label"] == "6"])
# print("CURIOSITY: \n", df5[df5["label"] == "7"])
# print("ANNOYANCE: \n", df5[df5["label"] == "3"])
# print("DISSAPROVAL: \n", df5[df5["label"] == "10"])

# df6 = pd.read_csv(
#     r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\emotion_datasets\goemotions_train.csv", index_col=False)
# print("GOEMOTIONS TRAIN: \n")
# print("CONFUSION: \n", df6[df6["label"] == "6"])
# print("CURIOSITY: \n", df6[df6["label"] == "7"])
# print("ANNOYANCE: \n", df6[df6["label"] == "3"])
# print("DISSAPROVAL: \n", df6[df6["label"] == "10"])


# print("DISGUST: \n", df4[df4["label"] == "11"])
# print("DISGUST: \n", df5[df5["label"] == "11"])
# print("DISGUST: \n", df6[df6["label"] == "11"])
