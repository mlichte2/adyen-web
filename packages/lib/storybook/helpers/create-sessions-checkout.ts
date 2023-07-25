import AdyenCheckout from '../../src/index';
import { createSession } from './checkout-api-calls';
import { RETURN_URL, SHOPPER_REFERENCE } from '../config/commonConfig';
import { handleChange, handleError, handleFinalState } from './checkout-handlers';
import getCurrency from '../utils/get-currency';
import { AdyenCheckoutProps } from '../stories/types';
import Checkout from '../../src/core/core';

async function createSessionsCheckout({
    showPayButton,
    paymentMethodsConfiguration,
    countryCode,
    shopperLocale,
    amount
}: AdyenCheckoutProps): Promise<Checkout> {
    const session = await createSession({
        amount: {
            currency: getCurrency(countryCode),
            value: Number(amount)
        },
        shopperLocale,
        countryCode,
        reference: 'ABC123',
        returnUrl: RETURN_URL,
        shopperReference: SHOPPER_REFERENCE,
        shopperEmail: 'shopper.ctp1@adyen.com'
    });

    const checkout = await AdyenCheckout({
        clientKey: process.env.CLIENT_KEY,
        environment: process.env.CLIENT_ENV,
        session,
        showPayButton,
        paymentMethodsConfiguration,
        // @ts-ignore TODO: Fix beforeSubmit type
        beforeSubmit: (data, component, actions) => {
            actions.resolve(data);
        },

        onPaymentCompleted: (result, component) => {
            handleFinalState(result, component);
        },

        onError: (error, component) => {
            handleError(error, component);
        },

        onChange: (state, component) => {
            handleChange(state, component);
        }
    });

    return checkout;
}

export { createSessionsCheckout };
