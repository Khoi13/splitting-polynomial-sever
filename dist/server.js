import express from 'express';
const app = express();
const port = 8000;
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
        const multiple = firstCo * freeCo;
        const sum = secondCo;
        const isSumPos = sum > 0;
        let i = isSumPos ? 1 : -1;
        while (i <= Math.round(Math.abs(multiple) / 2)) {
            if (i * (sum - i) === multiple) {
                return {
                    statusCode: 200,
                    status: 'SUCCESS',
                    message: 'Success!',
                    request: {
                        firstCo,
                        secondCo,
                        freeCo,
                    },
                    result: {
                        x: i,
                        y: sum - i,
                    },
                };
            }
            isSumPos ? i++ : i--;
        }
        if (sum == multiple + 1) {
            return {
                statusCode: 200,
                status: 'SUCCESS',
                message: 'Success!',
                request: {
                    firstCo,
                    secondCo,
                    freeCo,
                },
                result: {
                    x: 1,
                    y: multiple / 1,
                },
            };
        }
        else if (sum == multiple - 1) {
            return {
                statusCode: 200,
                status: 'SUCCESS',
                message: 'Success!',
                request: {
                    firstCo,
                    secondCo,
                    freeCo,
                },
                result: {
                    x: -1,
                    y: multiple / -1,
                },
            };
        }
    }
    return {
        statusCode: 404,
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
    res.status(resData.statusCode).json(resData);
});
app.listen(port, () => {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
