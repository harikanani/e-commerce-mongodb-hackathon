const stripe = require("stripe")("sk_test_Bf3qfiWQP5dY5SszSRIweuQ600mw0Bs7sP");
const { v4: uuid } = require("uuid");

exports.payment = [
    (req, res) => {
        const { cartProduct, token, totalPrice } = req.body;
        // console.log("PRODUCT ", product);
        // console.log("PRICE ", product.price);

        const idempontencyKey = uuid()

        try {
            return stripe.customers.create({
                email: token.email,
                source: token.id
            }).then(customer => {
                stripe.charges.create({
                    amount: totalPrice * 100,
                    currency: 'INR',
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `Purchase of ${`e-commerce`}`,
                    // shipping: {
                    //     name: "John Doe",
                    //     address: {
                    //         line1: "510 Townsend St",
                    //         postal_code: 98140,
                    //         city: "San Francisco",
                    //         state: "CA",
                    //         // postal_code: "395004",
                    //         country: "USA"
                    //     }
                    // }
                })
            }).then(result => {
                res.status(200).json(result)
            }).catch(err => {
                console.log("ERROR ", err)
                res.status(400).send({
                    message: "Payment Failed!",
                    error: err
                })
            });
        } catch(err) {
            console.log("try: ", err);
            res.status(500).send({
                message: "Something Went Wrong!",
                error: err
            })
        }

    }
];