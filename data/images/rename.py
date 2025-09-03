import os 

for file_dir in os.listdir("./"):
    os.rename(file_dir, file_dir.replace("товар", "product"))
    print(file_dir," renamed to ", file_dir.replace("товар", "product"))