// Importa as dependências necessárias
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

// Cria uma instância do aplicativo Express
const app = express();

// Cria um roteador para gerenciar rotas
const router = express.Router();

// Configura o middleware
app.use(cors()); // Habilita CORS para permitir solicitações de diferentes origens
app.use(express.json()); // Faz o Express analisar o corpo das solicitações como JSON
app.use("/", router); // Define o roteador para gerenciar as rotas

// Configura o transporte de e-mail usando nodemailer
const contactEmail = nodemailer.createTransport({
    service: 'gmail', // Serviço de e-mail utilizado
    auth: {
        user: process.env.EMAIL_USER, // Endereço de e-mail que será usado
        pass: process.env.EMAIL_PASS, // Senha específica de aplicações que usa o e-mail
    },
});

// Verifica a configuração do transporte de e-mail
contactEmail.verify((error) => {
    if (error) {
        console.log(error); // Exibe erros na configuração
    } else {
        console.log("Ready to Send"); // Confirma que a configuração está pronta
    }
});

// Define uma rota POST para o formulário de contato
router.post("/contact", (req, res) => {
    const name = req.body.firstName + ' ' + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;

    const mail = {
        from: name, // Nome do remetente
        to: process.env.EMAIL_USER, // Endereço de e-mail do destinatário
        subject: "Contact Form Submission - Portfolio", // Assunto do e-mail
        html: `<p>Name: ${name}</p>
               <p>Email: ${email}</p>
               <p>Phone: ${phone}</p>
               <p>Message: ${message}</p>`,
    };

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json(error); // Retorna o erro se a mensagem não for enviada
        } else {
            res.json({ code: 200, status: "Message Sent" }); // Retorna sucesso se a mensagem for enviada
        }
    });
});

// Define a porta dinamicamente, com fallback para a porta 5000
const port = process.env.PORT || 5000;

// Inicia o servidor na porta port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});