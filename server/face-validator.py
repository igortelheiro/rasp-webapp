import cv2
import os
import face_recognition

# Função para carregar as imagens cadastradas e codificar as faces
def carregar_faces_cadastradas(directory):
    face_encodings = []
    for subdir, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".png"):
                image_path = os.path.join(subdir, file)
                image = face_recognition.load_image_file(image_path)
                encodings = face_recognition.face_encodings(image)
                if encodings:
                    face_encodings.append(encodings[0])
    return face_encodings

# Diretório onde as imagens cadastradas estão armazenadas
faces_cadastradas_dir = "coletas_faciais"
faces_cadastradas = carregar_faces_cadastradas(faces_cadastradas_dir)

# Inicializa a webcam
cap = cv2.VideoCapture(0)

# Cria uma janela única para exibição
cv2.namedWindow("Verificação de Rosto", cv2.WINDOW_NORMAL)

while True:
    # Captura o quadro da webcam
    ret, frame = cap.read()
    if not ret:
        break

    # Converte o quadro para RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Localiza todas as faces no quadro atual da webcam
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    # Verifica cada face encontrada no quadro
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(faces_cadastradas, face_encoding)
        name = "Desconhecido"

        # Se houver correspondência, considera como face cadastrada
        if True in matches:
            name = "Cadastrado"

        # Desenha um retângulo ao redor da face e exibe se está cadastrado ou não
        for (top, right, bottom, left) in face_locations:
            color = (0, 255, 0) if name == "Cadastrado" else (0, 0, 255)
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    # Exibe o quadro com as verificações
    cv2.imshow("Verificação de Rosto", frame)

    # Pressiona 'q' para sair do loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Libera a câmera e fecha as janelas
cap.release()
cv2.destroyAllWindows()
