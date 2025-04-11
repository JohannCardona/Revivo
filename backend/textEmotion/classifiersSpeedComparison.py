import keras
import transformers
import time

# Code for the experiments on GPU server
start = time.time()
emotionClassifier = keras.models.load_model(
    r"Revivo\backend\textEmotion\checkpoint\distil_connect_drop2.h5", custom_objects={"TFDistilBertModel": transformers.TFDistilBertModel})
end = time.time()
print(f"DistilBERT - Execution lasted: {end - start} sec")

start1 = time.time()
emotionClassifier1 = keras.models.load_model(
    r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\textEmotion\checkpoint\model.h5", custom_objects={"TFBertModel": transformers.TFBertModel})
end1 = time.time()
print(f"BERT - Execution lasted: {end1 - start1} sec")

start2 = time.time()
emotionClassifier2 = keras.models.load_model(r"C:\Users\JohCa\Documents\GitHub\Revivo\backend\textEmotion\checkpoint\tiny_bert_connect_drop2.h5", custom_objects={
    "TFBertModel": transformers.TFBertModel})
end2 = time.time()
print(f"TinyBert - Execution lasted: {end2 - start2} sec")
