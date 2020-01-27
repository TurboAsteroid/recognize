import face_recognition
import cv2
import sys
from os import walk
from os import listdir
import os
import pickle

known_face_encodings = []
known_face_names = []
'''
for name in listdir("./public/faces/"):
    img_array = []
    for img in listdir("./public/faces/" + name):
        tmp = face_recognition.load_image_file("./public/faces/" + name + "/" + img)
        face = face_recognition.face_encodings(tmp)[0]
        known_face_encodings.append(face)
        known_face_names.append(name)

with open("./public/db_imgs", "wb") as file_img:
    pickle.dump(known_face_encodings, file_img, pickle.HIGHEST_PROTOCOL)
with open("./public/db_names", "wb") as file_names:
    pickle.dump(known_face_names, file_names, pickle.HIGHEST_PROTOCOL)
'''

with open("./public/db_imgs", "rb") as file_img:
    known_face_encodings = pickle.load(file_img)
with open("./public/db_names", "rb") as file_names:
    known_face_names = pickle.load(file_names)



# Initialize some variables
face_locations = []
face_encodings = []
face_names = []


for filename in sys.stdin:
    frame = cv2.imread("./upload/" + filename.rstrip())
    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]


    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    face_names = []
    name = ""
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        # If a match was found in known_face_encodings, just use the first one.
        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]

    face_names.append(name)
    print(filename.rstrip() + "|||***|||" + name.rstrip())
    sys.stdout.flush()