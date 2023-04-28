import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 8000;

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

type DataIn = {
    firstCo: any;
    secondCo: any;
    freeCo: any;
};

const handleResult = ({ firstCo = 1, secondCo = NaN, freeCo = NaN }: DataIn) => {
    const dataOut = {
        status: 403,
        message: 'Cannot split',
        result: {
            firstCo,
            secondCo,
            freeCo,
            value: {
                x: NaN,
                y: NaN,
            },
        },
    };

    if (!+firstCo) {
        dataOut.message = 'Invalid firstCo';
    } else if (!+secondCo) {
        dataOut.message = 'Invalid secondCo';
    } else if (!+freeCo) {
        dataOut.message = 'Invalid freeCo';
    } else {
        const multiple = firstCo * freeCo;
        const sum = secondCo;
        const isSumPos = sum > 0;
        let i = isSumPos ? 1 : -1;
        while (i <= Math.abs(multiple) || i <= multiple) {
            if (i * (sum - i) === multiple) {
                dataOut.status = 200;
                dataOut.message = 'Success!';
                dataOut.result.value.x = i;
                dataOut.result.value.y = sum - i;
                break;
            }
            isSumPos ? i++ : i--;
        }
    }

    return dataOut;
};

app.get('/', (req: Request, res: Response) => {
    const { firstCo, secondCo, freeCo } = req.query;

    const resData = handleResult({ firstCo, secondCo, freeCo });

    res.status(resData.status).json(resData);
});

app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
