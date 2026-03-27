import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res)=> {
    res.status(200).json({ status: 'OK', message: 'L\'API fonctionne parfaitement' });  
});

export default app;
