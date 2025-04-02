import pandas as pd
import tensorflow as tf
import keras
from sklearn import preprocessing, model_selection
import numpy as np
import matplotlib.pyplot as plt
import transformers


def label_encoding(df: pd.DataFrame):
    encoder = preprocessing.LabelEncoder()
    df["label"] = encoder.fit_transform(df["label"])
    return df


def train_val_test_split(df: pd.DataFrame):
    X_train, X_temp, y_train, y_temp = model_selection.train_test_split(
        df["text"].to_list(), df["label"].to_list(), train_size=0.7, random_state=42, shuffle=True)
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


def convert_data_to_tensors(X_train_input, X_val_input, X_train_mask, X_val_mask, y_train, y_val, batch):
    train_ds = tf.data.Dataset.from_tensor_slices(
        ((X_train_input, X_train_mask), tf.convert_to_tensor(y_train))).shuffle(1000).batch(batch)
    val_ds = tf.data.Dataset.from_tensor_slices(
        ((X_val_input, X_val_mask), tf.convert_to_tensor(y_val))).batch(batch)
    return train_ds, val_ds


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
    output_emotion = keras.layers.Dense(
        6, activation="softmax")(output)
    emotion_model = keras.models.Model(
        inputs=[emotion_text_ids, emotion_text_masks], outputs=output_emotion)

    emotion_model.compile(
        optimizer=optimizer,
        loss=loss,
        metrics=["accuracy"]
    )

    return emotion_model


if __name__ == "__main__":
    training = False
    LR = 0.00002
    OPTIMIZER = keras.optimizers.Adam(learning_rate=LR)
    LOSS = "sparse_categorical_crossentropy"
    BATCH = 64
    EPOCHS = 5
    MODEL_NAME = "bert-base-uncased"
    MAX_LENGTH = 128
    NUM_LABELS = 6
    if training == True:
        modelCheckpoint = keras.callbacks.ModelCheckpoint(
            "backend\textEmotion\checkpoint\model.h5", monitor="val_loss", save_best_only=True, mode="min")
        df = pd.read_csv(
            "backend\preprocessing\processed\dair-ai-emotion.csv")
        df = label_encoding(df=df.head(15000))
        train_features, val_features, test_features, train_labels, val_labels, test_labels = train_val_test_split(
            df=df)
        train_tokens, val_tokens, test_tokens = tokenize_sentences(
            train_features, val_features, test_features, MODEL_NAME, MAX_LENGTH)
        train_set, val_set = convert_data_to_tensors(
            train_tokens["input_ids"], val_tokens["input_ids"], train_tokens["attention_mask"], val_tokens["attention_mask"], train_labels, val_labels, BATCH)
        train_set = train_set.prefetch(tf.data.AUTOTUNE)
        train_set = train_set.cache()
        val_set = val_set.prefetch(tf.data.AUTOTUNE)
        val_set = val_set.cache()
        emotionClassifier = emotion_model(
            MODEL_NAME, MAX_LENGTH, OPTIMIZER, LOSS)
        print("TRAINING...")
        history = emotionClassifier.fit(
            x=train_set, epochs=EPOCHS, validation_data=(val_set), callbacks=[modelCheckpoint])

        loss_values = history.history["loss"]
        val_loss_values = history.history["val_loss"]
        acc_values = history.history["accuracy"]
        val_acc_values = history.history["val_accuracy"]

        plt.figure(figsize=(12, 8))
        plt.plot(history.epoch, loss_values, label="TRAIN LOSS")
        plt.plot(history.epoch, val_loss_values, label="VAL LOSS")
        plt.legend(loc="upper right")
        plt.xlabel("EPOCHS")
        plt.ylabel("LOSS")
        plt.show()

        plt.figure(figsize=(12, 8))
        plt.plot(history.epoch, acc_values, label="TRAIN ACCURACY")
        plt.plot(history.epoch, val_acc_values, label="VAL ACCURACY")
        plt.legend(loc="upper right")
        plt.xlabel("EPOCHS")
        plt.ylabel("ACCURACY")
        plt.show()

        test_set = tf.data.Dataset.from_tensor_slices(
            ((test_tokens["input_ids"], test_tokens["attention_mask"]), tf.convert_to_tensor(test_labels))).batch(BATCH)
        test_set = test_set.prefetch(tf.data.AUTOTUNE)
        test_set = test_set.cache()
        loss, acc = emotionClassifier.evaluate(test_set)
