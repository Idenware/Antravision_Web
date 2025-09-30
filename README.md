# 🌱 AntraVision - Monitoramento Inteligente de Antracnose

![Logo](Front/frontend-react/src/assets/new_logo.svg)

Bem-vindo ao **AntraVision**!  
Uma plataforma inteligente para monitoramento, análise e prevenção de antracnose em plantações de pupunheira.

---

## 🚀 Visão Geral

O AntraVision integra tecnologias modernas para oferecer uma solução completa de acompanhamento fitossanitário:

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Flask (Python) + MongoDB
- **Funcionalidades:**
  - Cadastro e login de usuários
  - Registro e histórico de casos de antracnose
  - Visualização de viveiros, estatísticas e previsões de risco
  - Notificações inteligentes
  - Interface intuitiva

---

## 📦 Estrutura do Projeto

```
Projeto-Integrador/
│
├── Back/                # Backend (Flask)
│   ├── api/
│   │   ├── models/
│   │   ├── resources/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── run.py
│
└── Front/
    └── frontend-react/  # Frontend (React)
        ├── src/
        ├── public/
        ├── package.json
        └── ...
```

---

## 🛠️ Como Rodar o Projeto

### 1. Backend (Flask)

```sh
cd Back
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
cp .env.example .env      # Configure as variáveis de ambiente
python run.py
```

O backend estará disponível em `http://localhost:5000`.

---

### 2. Frontend (React)

```sh
cd Front/frontend-react
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## ✨ Funcionalidades Principais

- **Dashboard:** Visualização geral dos viveiros, saúde das plantas e alertas.
- **Histórico:** Consulta e edição dos casos registrados.
- **Notificações:** Alertas automáticos sobre riscos e condições críticas.
- **Gestão de Usuários:** Cadastro, login e gerenciamento de perfil.
- **Previsão de Risco:** Análise inteligente baseada nos dados dos casos.

---

## 📸 Screenshots

Abaixo estão algumas telas principais do sistema:

| Tela                            | Imagem                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Tela de Login                   | ![Tela de Login](Front/frontend-react/src/assets/TeladeLogin.png)                    |
| Tela de Cadastro 1° Etapa       | ![Tela de Cadastro1](Front/frontend-react/src/assets/TeladeCadastro1.png)            |
| Tela de Cadastro 2° Etapa       | ![Tela de Cadastro2](Front/frontend-react/src/assets/TeladeCadastro2.png)            |
| Tela de Inicio                  | ![Tela de Login](Front/frontend-react/src/assets/TelaInicial.png)                    |
| Tela de Dashboard               | ![Tela de Dashboard](Front/frontend-react/src/assets/TeladeDashboard.png)            |
| Tela de Histórico               | ![Tela de Histórico](Front/frontend-react/src/assets/TeladeHistorico.png)            |
| Tela de Perfil                  | ![Tela de Perfil](Front/frontend-react/src/assets/TeladeConfiguracoes.png)           |
| Tela de Estatísticas            | ![Tela de Estatísticas](Front/frontend-react/src/assets/TelaModal.png)               |
| Tela de Visualização de Viveiro | ![Tela de Visualização de Viveiro](Front/frontend-react/src/assets/TelaViveiros.png) |

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir issues ou pull requests.

---

## 📝 Licença

Este projeto é acadêmico e para fins educacionais.

---

## 👨‍💻 Desenvolvido por

- Gabriel Henrique Rodrigues de Salles

---

> **AntraVision** — Monitoramento inteligente para um futuro mais saudável no campo!
