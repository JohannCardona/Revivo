import pandas as pd
import tensorflow as tf
import keras
from sklearn import preprocessing, model_selection, metrics
import numpy as np
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
import transformers


def label_encoding(df: pd.DataFrame):
    encoder = preprocessing.LabelEncoder()
    df["label"] = encoder.fit_transform(df["label"])
    return df


def train_val_test_split(df: pd.DataFrame):
    print(df["text"].head().tolist())
    print(df["label"].head().tolist())
    X_train, X_temp, y_train, y_temp = model_selection.train_test_split(
        df["text"].to_list(), df["label"].to_list(), train_size=0.6, random_state=42, shuffle=True)
    X_val, X_test, y_val, y_test = model_selection.train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, shuffle=True)
    return X_train, X_val, X_test, y_train, y_val, y_test


def tokenize_sentences(X_train_text, X_val_text, X_test_text, model_name, max_length):
    sentence_tokenizer = transformers.BertTokenizer.from_pretrained(model_name)
    train_text_tokens = sentence_tokenizer(
        X_train_text, add_special_tokens=True, padding="max_length", truncation=True, max_length=max_length, return_tensors="tf")
    val_text_tokens = sentence_tokenizer(
        X_val_text, add_special_tokens=True, padding="max_length", truncation=True, max_length=max_length, return_tensors="tf")
    test_text_tokens = sentence_tokenizer(
        X_test_text, add_special_tokens=True, padding="max_length", truncation=True, max_length=max_length, return_tensors="tf")
    return train_text_tokens, val_text_tokens, test_text_tokens


def convert_data_to_tensors(X_train, X_val, X_test, y_train, y_val, y_test, batch):
    train_ds = tf.data.Dataset.from_tensor_slices(
        (dict(X_train), tf.convert_to_tensor(y_train))).shuffle(1000).batch(batch)
    val_ds = tf.data.Dataset.from_tensor_slices(
        (dict(X_val), tf.convert_to_tensor(y_val))).batch(batch)
    test_ds = tf.data.Dataset.from_tensor_slices(
        (dict(X_test), tf.convert_to_tensor(y_test))).batch(batch)
    return train_ds, val_ds, test_ds


def bert_model(model_name, num_labels, optimizer, loss):
    model = transformers.TFBertForSequenceClassification.from_pretrained(
        model_name, num_labels=num_labels)
    model.compile(optimizer=optimizer, loss=loss, metrics=["accuracy"])
    return model


def emotion_model(model_name, max_length, optimizer, loss):
    bert_layer = transformers.TFBertModel.from_pretrained(model_name)
    emotion_text_ids = keras.layers.Input(
        shape=(max_length,), dtype=tf.int32, name="emotion_input_ids")
    emotion_text_masks = keras.layers.Input(
        shape=(max_length,), dtype=tf.int32, name="emotion_attention_masks")
    outputs = bert_layer(input_ids=emotion_text_ids,
                         attention_mask=emotion_text_masks)
    output = outputs[1]
    connected_layer = keras.layers.Dense(128, activation="relu")(output)
    output_regressor = keras.layers.Dense(
        6, activation="softmax")(connected_layer)
    emotion_model = keras.models.Model(
        inputs=[emotion_text_ids, emotion_text_masks], outputs=output_regressor)

    emotion_model.compile(
        optimizer=optimizer,
        loss=loss,
        metrics=["accuracy"]
    )

    return emotion_model


stop_words = set(stopwords.words("english"))
LR = 0.00002
OPTIMIZER = keras.optimizers.Adam(learning_rate=LR)
LOSS = "sparse_categorical_crossentropy"
BATCH = 64
EPOCHS = 5
MODEL_NAME = "bert-base-uncased"
MAX_LENGTH = 128
NUM_LABELS = 6

df = pd.read_csv(
    r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\preprocessing\processed\dair-ai-emotion.csv")
print(df)
df = label_encoding(df=df)
print(df)
print("TRAIN VAL TEST SPLIT")
train_features, val_features, test_features, train_labels, val_labels, test_labels = train_val_test_split(
    df=df)
print("train features: ", len(train_features))
print("val features: ", len(val_features))
print("test features: ", len(test_features))
print("TRAIN VAL TEST TOKENIZE")
train_tokens, val_tokens, test_tokens = tokenize_sentences(
    train_features, val_features, test_features, MODEL_NAME, MAX_LENGTH)
print(train_tokens[5])
exit()
print("TRAIN VAL TEST TENSORS")
train_set, val_set, test_set = convert_data_to_tensors(
    train_tokens, val_tokens, test_tokens, train_labels, val_labels, test_labels, BATCH)
print("BERT MODEL")
emotionClassifier = emotion_model(MODEL_NAME, MAX_LENGTH, OPTIMIZER, LOSS)
print("TRAINING...")
history = emotionClassifier.fit(
    x=train_set, epochs=EPOCHS, validation_data=val_set)
print(history)
