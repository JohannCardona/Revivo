import pandas as pd
import tensorflow as tf
import keras
import numpy as np
from sklearn import preprocessing, model_selection, metrics
import transformers
import matplotlib.pyplot as plt
import seaborn as sns


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


# Code from experiments in GPU server
def TinyBERT_emotion_model(model_name, max_length, optimizer, loss):
    bert_layer = transformers.TFAutoModel.from_pretrained(
        model_name, from_pt=True)
    emotion_text_ids = keras.layers.Input(
        shape=(max_length,), dtype=tf.int32, name="emotion_input_ids")
    emotion_text_masks = keras.layers.Input(
        shape=(max_length,), dtype=tf.int32, name="emotion_attention_masks")
    outputs = bert_layer(input_ids=emotion_text_ids,
                         attention_mask=emotion_text_masks)
    output = outputs.last_hidden_state[:, 0, :]
    connected_layer = keras.layers.Dense(128, activation="relu")(output)
    drop = keras.layers.Dropout(0.1)(connected_layer)
    output_emotion = keras.layers.Dense(
        6, activation="softmax")(drop)
    emotion_model = keras.models.Model(
        inputs=[emotion_text_ids, emotion_text_masks], outputs=output_emotion)

    emotion_model.compile(
        optimizer=optimizer,
        loss=loss,
        metrics=["accuracy"]
    )

    return emotion_model


# Code from experiments in GPU server
def BERT_emotion_model(model_name, max_length, optimizer, loss):
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


# Code from experiments in GPU server
def DistilBERT_emotion_model(model_name, max_length, optimizer, loss):
    bert_layer = transformers.TFBertModel.from_pretrained(model_name)
    emotion_text_ids = keras.layers.Input(
        shape=(max_length,), dtype=tf.int32, name="emotion_input_ids")
    emotion_text_masks = keras.layers.Input(
        shape=(max_length,), dtype=tf.int32, name="emotion_attention_masks")
    outputs = bert_layer(input_ids=emotion_text_ids,
                         attention_mask=emotion_text_masks)
    output = outputs[1]
    drop_out = keras.layers.Dropout(0.25)(output)
    output_emotion = keras.layers.Dense(
        6, activation="softmax")(drop_out)
    emotion_model = keras.models.Model(
        inputs=[emotion_text_ids, emotion_text_masks], outputs=output_emotion)

    emotion_model.compile(
        optimizer=optimizer,
        loss=loss,
        metrics=["accuracy"]
    )

    return emotion_model


# Code from experiments in GPU server
if __name__ == "__main__":
    training = True
    LR = 2e-5
    OPTIMIZER = keras.optimizers.Adam(learning_rate=LR)
    log_dir = "checkpoint/log"
    TENSORBOARD = keras.callbacks.TensorBoard(log_dir=log_dir)
    EARLY_STOPPING = keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=5, mode="min", restore_best_weights=True)
    LOSS = "sparse_categorical_crossentropy"
    BATCH = 64
    EPOCHS = 20
    MODEL_NAME1 = "bert-base-uncased"
    MODEL_NAME = "huawei-noah/TinyBERT_General_4L_312D"
    MODEL_NAME2 = "distilbert-base-uncased"
    MAX_LENGTH = 128
    NUM_LABELS = 6
    if training == True:
        modelCheckpoint = keras.callbacks.ModelCheckpoint(
            r"Revivo\backend\textEmotion\checkpoint\tiny_bert_connect_drop2.h5", monitor="val_loss", save_best_only=True, mode="min")
        df = pd.read_csv(
            r"Revivo\backend\preprocessing\emotion_processed\dair-ai-emotion.csv")
        df = label_encoding(df=df)
        print("train test split")
        train_features, val_features, test_features, train_labels, val_labels, test_labels = train_val_test_split(
            df=df)
        print("text tokenisation")
        train_tokens, val_tokens, test_tokens = tokenize_sentences(
            train_features, val_features, test_features, MODEL_NAME, MAX_LENGTH)
        print("tensor converter for data performance")
        train_set, val_set = convert_data_to_tensors(
            train_tokens["input_ids"], val_tokens["input_ids"], train_tokens["attention_mask"], val_tokens["attention_mask"], train_labels, val_labels, BATCH)
        train_set = train_set.prefetch(tf.data.AUTOTUNE)
        train_set = train_set.cache()
        val_set = val_set.prefetch(tf.data.AUTOTUNE)
        val_set = val_set.cache()
        emotionClassifier = TinyBERT_emotion_model(
            MODEL_NAME, MAX_LENGTH, OPTIMIZER, LOSS)
        print("TRAINING...")
        history = emotionClassifier.fit(
            x=train_set, epochs=EPOCHS, validation_data=(val_set), callbacks=[modelCheckpoint])
        emotionClassifier = keras.models.load_model(r"Revivo\backend\textEmotion\checkpoint\tiny_bert_connect_drop2.h5", custom_objects={
            "TFBertModel": transformers.TFBertModel, })
        test_set = tf.data.Dataset.from_tensor_slices(
            ((test_tokens["input_ids"], test_tokens["attention_mask"]), tf.convert_to_tensor(test_labels))).batch(BATCH)
        test_set = test_set.prefetch(tf.data.AUTOTUNE)
        test_set = test_set.cache()
        loss, acc = emotionClassifier.evaluate(test_set)
        print(loss, acc)

        user_input = [np.array(test_tokens["input_ids"]),
                      np.array(test_tokens["attention_mask"])]
        preds = emotionClassifier.predict(user_input)
        predicted_labels = np.argmax(preds.tolist(), axis=1)

        confusion_matrix = metrics.confusion_matrix(
            test_labels, predicted_labels)
        plt.figure(figsize=(8, 6))
        sns.heatmap(confusion_matrix, annot=True,
                    fmt="d", cmap="Blues", cbar=False)
        plt.title("Confusion Matrix")
        plt.ylabel("True Label")
        plt.xlabel("Predicted Label")
        plt.savefig("confusion_matrix.png")

        labels = [f"Class {i}" for i in range(6)]
        classification_report = metrics.classification_report(
            test_labels, predicted_labels, target_names=labels)
