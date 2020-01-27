import sys
import os
from os import listdir

for filename in sys.stdin:
    #print(listdir("../public/faces/"))
    #sys.stdout.flush()

    
    for name in listdir("../public/faces/"):
        #print(name)
        #sys.stdout.flush()
        if not os.path.exists("../public/faces_2/"+ name.split('.')[0] + "/"):
            os.makedirs("../public/faces_2/"+ name.split('.')[0] + "/")
        os.rename("../public/faces/"+ name, "../public/faces_2/"+ name.split('.')[0] + "/" + name)
        
    #cv2.imread("./upload/" + filename)
    
    