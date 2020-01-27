import logging
import math
from sklearn import neighbors
import os
import os.path
import pickle
from PIL import Image, ImageDraw
import face_recognition
from face_recognition.face_recognition_cli import image_files_in_folder
import time
import shutil
import sys
import cv2
from time import gmtime, strftime
import random
#import mysql.connector
#from mysql.connector import errorcode

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def loadClf( model_path=None ):
    if model_path is None:
        raise Exception("Must supply model_path")
        return None
    with open(model_path, 'rb') as f:
        knn_clf = pickle.load(f)
        return knn_clf

def predict(image, knn_clf=None, model_path=None, distance_threshold=0.6):
    X_face_locations = face_recognition.face_locations(image)

    # If no faces are found in the image, return an empty result.
    if len(X_face_locations) == 0:
        return []

    # Find encodings for faces in the test iamge
    faces_encodings = face_recognition.face_encodings(image, known_face_locations=X_face_locations)

    # Use the KNN model to find the best matches for the test face
    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=1)
    are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(X_face_locations))]

    # Predict classes and remove classifications that aren't within the threshold
    return [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in zip(knn_clf.predict(faces_encodings), X_face_locations, are_matches)]


if __name__ == "__main__":
    logging.basicConfig(filename='example.log',level=logging.DEBUG)
    classifier = loadClf("./python/uemAuto.clf")
    cap = cv2.VideoCapture("rtsp://admin:Qwert12345@10.10.4.101:554/")
    #cnx = mysql.connector.connect(user='lvo', password='vo324adHHG', host='10.1.255.117', database='gsm_db')
    
    process_this_frame = True
    all_faces_find = 0
    faces_unrecognize = 0
    
    while(True):
        ret, frame = cap.read()
        if process_this_frame:
            small_frame = frame[600:2000, 1800:3800] 
            small_frame = cv2.resize(small_frame, (0, 0), fx=0.5, fy=0.5)
            
            #start = time.time()
            rgb_small_frame = small_frame[:, :, ::-1]
            predictions = predict(rgb_small_frame, knn_clf=classifier, model_path="trained_knn_model.clf")
            for name, (top, right, bottom, left) in predictions:
                all_faces_find = all_faces_find + 1
                if name == "unknown":
                    faces_unrecognize = faces_unrecognize + 1
                    message = "Face unrecognized: " + name + "; \n"
                    logging.warning(message)
                else:
                    message = "New face recognize: " + name + "; \n"
                    logging.info(message)
                    if not os.path.exists("./detected/" + name):
                        os.makedirs("./detected/" + name)
                n = "./detected/" + name + "/" + strftime("%Y%d%H%M%S", gmtime()) + "_" + str(random.random()) + ".jpg"
                print(n)
                cv2.imwrite(n,small_frame)
                message = "Total faces find: " + str(all_faces_find) + ". Faces unrecognize: " + str(faces_unrecognize)
                logging.info(message)

            #end = time.time()
            #print("Full training for " + str(end - start))
            sys.stdout.flush()
        process_this_frame = not process_this_frame
        print(str(all_faces_find))
        cv2.imshow("1", small_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break