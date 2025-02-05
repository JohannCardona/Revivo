import keras
import transformers
from transformers.optimization_tf import WarmUp
import time

start = time.time()
emotionClassifier = keras.models.load_model(
    r"\checkpoint\distil_connect_drop2.h5", custom_objects={"TFDistilBertModel": transformers.TFDistilBertModel, "WarmUp": WarmUp})
print(emotionClassifier)
end = time.time()
print(f"Execution lasted: {end - start} sec")

start1 = time.time()
emotionClassifier1 = keras.models.load_model(
    r"\textEmotion\checkpoint\model.h5", custom_objects={"TFBertModel": transformers.TFBertModel})
print(emotionClassifier1)
end1 = time.time()
print(f"Execution lasted: {end1 - start1} sec")

start2 = time.time()
emotionClassifier2 = keras.models.load_model(r"\checkpoint\tiny_bert_connect_drop2.h5", custom_objects={
    "TFBertModel": transformers.TFBertModel, "WarmUp": WarmUp})
print(emotionClassifier2)
end2 = time.time()
print(f"Execution lasted: {end2 - start2} sec")
