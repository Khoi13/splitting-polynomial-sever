import express from 'express';
import 'dotenv/config';
const app = express();
const port = process.env.PORT || 8002;
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());
const handleResult = ({ firstCo = '1', secondCo = NaN, freeCo = NaN }) => {
    const invalidField = [];
    if (!+firstCo) {
        invalidField.push('firstCo');
    }
    if (!+secondCo) {
        invalidField.push('SecondCo');
    }
    if (!+freeCo) {
        invalidField.push('freeCo');
    }
    if (invalidField.length) {
        return {
            statusCode: 400,
            status: 'INVALID',
            message: 'The request data is invalid.',
            request: {
                firstCo,
                secondCo,
                freeCo,
            },
            invalidField,
        };
    }
    else {
        const dataOut = {
            statusCode: 200,
            status: 'SUCCESS',
            message: 'Success!',
            request: {
                firstCo,
                secondCo,
                freeCo,
            },
            result: {
                x: NaN,
                y: NaN,
            },
        };
        const multiple = firstCo * freeCo;
        const sum = secondCo;
        const isSumPos = sum > 0;
        const isMulPos = multiple > 0;
        let i = isSumPos ? 1 : -1;
        if (isMulPos) {
            while (i <= Math.round(multiple / 2) && i >= -Math.round(multiple / 2)) {
                if (i * (sum - i) === multiple) {
                    dataOut.result.x = i;
                    dataOut.result.y = sum - i;
                    return dataOut;
                }
                isSumPos ? i++ : i--;
            }
        }
        else {
            while (i >= Math.round((multiple + 1) / 2) && i <= -Math.round((multiple + 1) / 2)) {
                if (i * (sum - i) === multiple) {
                    dataOut.result.x = i;
                    dataOut.result.y = sum - i;
                    return dataOut;
                }
                isSumPos ? i++ : i--;
            }
        }
        let j = -1;
        while (j <= 1) {
            if (j * (sum - j) === multiple) {
                dataOut.result.x = j;
                dataOut.result.y = sum - j;
                return dataOut;
            }
            j++;
        }
    }
    return {
        statusCode: 200,
        status: 'CANNOT_SPLIT',
        message: 'The request is valid but cannot handle.',
        request: {
            firstCo,
            secondCo,
            freeCo,
        },
    };
};
app.get('/', (req, res) => {
    const { firstCo, secondCo, freeCo } = req.query;
    const resData = handleResult({ firstCo, secondCo, freeCo });
    res.header('Access-Control-Allow-Origin', '*');
    res.status(resData.statusCode).json(resData);
});
app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
