import firebase, {
    analytics,
    auth,
    firestore,
    storage,
    database,
} from "../firebase";

const signUp = (fields) => {
    return new Promise((resolve, reject) => {
        if (!fields) {
            reject();

            return;
        }

        const firstName = fields.firstName;
        const lastName = fields.lastName;
        const username = fields.username;
        const emailAddress = fields.emailAddress;
        const password = fields.password;

        if (
            !firstName ||
            !lastName ||
            !username ||
            !emailAddress ||
            !password
        ) {
            reject();

            return;
        }

        if (auth.currentUser) {
            reject();

            return;
        }

        auth.createUserWithEmailAndPassword(emailAddress, password)
            .then((value) => {
                const user = value.user;

                if (!user) {
                    reject();

                    return;
                }

                const uid = user.uid;

                if (!uid) {
                    reject();

                    return;
                }

                // const userDocumentReference = firestore
                //     .collection("users")
                //     .doc(uid);
                const userDocumentReference = database
                    .ref()
                    .child("user/" + uid);
                // .doc(uid);

                userDocumentReference
                    .set({
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                    })
                    .then((value) => {
                        analytics.logEvent("sign_up", {
                            method: "password",
                        });

                        resolve(value);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

const degerler = {
    firstName: "Berke",
    lastName: "Sonmez",
    username: "berkes",
    password: "123456",
    emailAddress: "berke@berke.com",
};

signUp(degerler);
