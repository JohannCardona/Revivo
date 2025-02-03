import os
import sys
import warnings
import logging
import absl.logging

# Suppress TensorFlow logs before importing it
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import tensorflow as tf
# Disable TensorFlow logging
tf.get_logger().setLevel(logging.ERROR)
logging.getLogger("tensorflow").disabled = True
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

# Suppress all warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
absl.logging.set_verbosity(absl.logging.ERROR)

# Redirect stdout and stderr (Extreme Case)
# sys.stdout = open(os.devnull, "w")
# sys.stderr = open(os.devnull, "w")
