const constraints = {
    firstName: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    lastName: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    username: {
        length: {
            minimum: 2,
            maximum: 20,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    emailAddress: {
        email: {
            message: "^Geçerli bir e-mail adresi değil",
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    emailAddressConfirmation: {
        email: {
            message: "^Geçerli bir e-mail adresi değil",
        },

        equality: {
            attribute: "emailAddress",
            message: "^Girilen e-mail adresleri aynı değil",
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    password: {
        length: {
            minimum: 6,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    passwordConfirmation: {
        equality: {
            attribute: "password",
            message: "^Girilen şifreler aynı değil",
        },
        length: {
            minimum: 6,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },
};

export default constraints;
