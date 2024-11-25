import pandas as pd
import re
import os
import emoji
from tqdm import tqdm
tqdm.pandas()


def load_data(path: str):
    df = pd.read_csv(path)
    return df


def save_processed_data(df: pd.DataFrame, new_path):
    return df.to_csv(new_path, index=False)


def url_preprocessing(sentence: str):
    URL_REGEX = r"""(?i)\b((?:https?:(?:/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:\'\".,<>?«»“”‘’])|(?:(?<!@)[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b/?(?!@)))"""
    ulr_removal = re.sub(URL_REGEX, "", sentence)
    return ulr_removal


def rawtext_preprocessing(sentence: str):
    TEXT_REGEX = re.compile(r"@\w+\s*|\t|\n|[^\w\s]")
    compiled_text = TEXT_REGEX.sub("", sentence)
    compiled_text = compiled_text.lower()
    return compiled_text


def emoji_preprocessing(sentence: str):
    emoji_to_text = emoji.demojize(sentence, delimiters=("", ""))
    processed_emoji = " ".join(emoji_to_text.split("_"))
    return processed_emoji


def sentence_preprocessing(sentence: str):
    no_url = url_preprocessing(sentence=sentence)
    no_emoji = emoji_preprocessing(sentence=no_url)
    processed_sentences = rawtext_preprocessing(sentence=no_emoji)
    return processed_sentences


def preprocess_datasets(path, new_folder, columns_to_keep):
    datasets = []
    os.makedirs(new_folder, exist_ok=True)
    for path, _, filenames in os.walk(path):
        print(filenames)
        for filename in filenames:
            if filename.endswith(".csv"):
                datasets.append(filename)

    for file, columns in zip(datasets, columns_to_keep):
        df = load_data(os.path.join(path, file))
        print(df)
        df["text"] = df["text"].progress_apply(
            sentence_preprocessing)
        df = df.dropna(axis=0)
        df = df[columns]
        new_path = os.path.join(new_folder, file)
        save_processed_data(df=df, new_path=new_path)

def convert_labels_to_lowercase(file_path:str, destination:str):
    df = load_data(file_path)
    df["label"] = df["label"].progress_apply(str.lower)
    filename = file_path.split("/")
    new_path = destination+"/"+filename[2]
    save_processed_data(df=df, new_path=new_path)


def convert_numeric_label_to_categorical(file_path: str, destination: str):
    df = load_data(file_path)
    df["label"] = df["label"].progress_apply(lambda label: "sadness" if label == 0 else "joy" if label == 1 else "love" if label == 2 else "anger" if label == 3 else "fear" if label == 4 else "surprise" if label == 5 else None)
    filename = file_path.split("/")
    new_path = destination+"/"+filename[2]
    save_processed_data(df=df, new_path=new_path)

if __name__ == "__main__":
    new_folder = "processed"
    emotion_path = "./emotion_datasets"
    health_path = "./mental_health_datasets"
    keep_columns_emotion = [
        ['text', 'label'],
        ['text', 'label'],
        ['text', 'admiration',
        'embarrassment', 'excitement', 'fear', 'gratitude', 'grief', 'joy',
        'love', 'nervousness', 'optimism', 'pride', 'realization', 'relief',
        'remorse', 'sadness', 'surprise', 'neutral'],
        ['text', 'label'],
        ['text', 'label']
    ]

    preprocess_datasets(path=emotion_path, new_folder=new_folder, columns_to_keep=keep_columns_emotion)
    convert_numeric_label_to_categorical(
        file_path="./processed/dair-ai-emotion.csv", destination=new_folder)
    convert_numeric_label_to_categorical(
        file_path="./processed/amuvarma_emotions-text.csv", destination=new_folder)
