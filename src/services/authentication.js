import firebase, {
    analytics,
    auth,
    firestore,
    storage,
    database,
} from "../firebase";

import moment from "moment";

const authentication = {};
// let key;
// let referance = database.ref("user");
authentication.signUp = (fields) => {
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

                const userDocumentReference = firestore
                    .collection("users")
                    .doc(uid);

                userDocumentReference.set({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                });

                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .push({
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
                // key = ref.name();
                // referance = ref;
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.signUpWithEmailAddressAndPassword = (emailAddress, password) => {
    return new Promise((resolve, reject) => {
        if (!emailAddress || !password) {
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

                const userDocumentReference = firestore
                    .collection("users")
                    .doc(uid);

                userDocumentReference.set({}, { merge: true });

                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .push()
                    .update({ email: emailAddress })
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

authentication.signIn = (emailAddress, password) => {
    return new Promise((resolve, reject) => {
        if (!emailAddress || !password) {
            reject();

            return;
        }

        if (auth.currentUser) {
            reject();

            return;
        }

        auth.signInWithEmailAndPassword(emailAddress, password)
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

                const userDocumentReference = firestore
                    .collection("users")
                    .doc(uid);

                userDocumentReference
                    .get({ source: "server" })
                    .then((value) => {
                        if (value.exists) {
                            analytics.logEvent("login", {
                                method: "password",
                            });

                            resolve(user);
                        } else {
                            userDocumentReference
                                .set({}, { merge: true })
                                .then((value) => {
                                    analytics.logEvent("login", {
                                        method: "password",
                                    });

                                    resolve(user);
                                })
                                .catch((reason) => {
                                    reject(reason);
                                });
                        }
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

authentication.sendSignInLinkToEmail = (emailAddress) => {
    return new Promise((resolve, reject) => {
        if (!emailAddress) {
            reject();

            return;
        }

        if (auth.currentUser) {
            reject();

            return;
        }

        const actionCodeSettings = {
            url: "rehber-2e983.web.app/verify?id=1234",
            handleCodeInApp: true,
        };

        auth.sendSignInLinkToEmail(emailAddress, actionCodeSettings)
            .then((value) => {
                analytics.logEvent("send_sign_in_link_to_email");

                localStorage.setItem("emailAddress", emailAddress);

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.signInWithEmailLink = (emailAddress, emailLink) => {
    return new Promise((resolve, reject) => {
        if (!emailAddress || !emailLink) {
            reject();

            return;
        }

        if (auth.currentUser) {
            reject();

            return;
        }

        auth.signInWithEmailLink(emailAddress, emailLink)
            .then((value) => {
                analytics.logEvent("login", {
                    method: "email-link",
                });

                localStorage.removeItem("emailAddress");

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.signInWithAuthProvider = (providerId) => {
    return new Promise((resolve, reject) => {
        if (!providerId) {
            reject();

            return;
        }

        const provider = new firebase.auth.OAuthProvider(providerId);

        if (!provider) {
            reject();

            return;
        }

        if (auth.currentUser) {
            reject();

            return;
        }

        auth.signInWithPopup(provider).then((value) => {
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
            console.log("hello", user);
            console.log("hello", user.email);
            const userDocumentReference = firestore
                .collection("users")
                .doc(uid);

            database
                .ref("user")
                .child(uid)
                .child("profile")
                .once("value", (k) => {
                    // console.log("1", k);
                    // let values = k.val();
                    // console.log("2", k.key);
                    // console.log("3", values[profileId].);
                    // console.log("3", values);
                    // console.log("id", profileId);
                    console.log("Hello");
                    console.log(k, k.exists());
                    if (!k.exists()) {
                        // let profileId = Object.keys(k.val())[0];
                        database
                            .ref("user")
                            .child(uid)
                            .child("profile")
                            .push()
                            .update({ email: user.email })
                            .then((value) => {
                                analytics.logEvent("login", {
                                    method: providerId,
                                });

                                resolve(user);
                            })
                            .catch((reason) => {
                                reject(reason);
                            });
                    } else {
                        analytics.logEvent("login", {
                            method: providerId,
                        });

                        resolve(user);
                    }
                })
                .then((value) => {
                    analytics.logEvent("login", {
                        method: providerId,
                    });

                    resolve(user);
                })
                .catch((reason) => {
                    reject(reason);
                });
            userDocumentReference.get({ source: "server" }).then((value) => {
                if (value.exists) {
                    // analytics.logEvent("login", {
                    //     method: providerId,
                    // });
                    // resolve(user);
                } else {
                    userDocumentReference.set({}, { merge: true });
                    // .then((value) => {
                    //     analytics.logEvent("login", {
                    //         method: providerId,
                    //     });

                    //     resolve(user);
                    // })
                    // .catch((reason) => {
                    //     reject(reason);
                    // });
                }
            });
            // .catch((reason) => {
            //     reject(reason);
            // });
        });
    });
};

authentication.linkAuthProvider = (providerId) => {
    return new Promise((resolve, reject) => {
        if (!providerId) {
            reject();

            return;
        }

        const provider = new firebase.auth.OAuthProvider(providerId);

        if (!provider) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        currentUser
            .linkWithPopup(provider)
            .then((value) => {
                analytics.logEvent("link_auth_provider", {
                    providerId: providerId,
                });

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.unlinkAuthProvider = (providerId) => {
    return new Promise((resolve, reject) => {
        if (!providerId) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        currentUser
            .unlink(providerId)
            .then((value) => {
                analytics.logEvent("unlink_auth_provider", {
                    providerId: providerId,
                });

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.authProviderData = (providerId) => {
    if (!providerId) {
        return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
        return;
    }

    const providerData = currentUser.providerData;

    if (!providerData) {
        return;
    }

    return providerData.find(
        (authProvider) => authProvider.providerId === providerId
    );
};

authentication.signOut = () => {
    return new Promise((resolve, reject) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        auth.signOut()
            .then((value) => {
                analytics.logEvent("sign_out");

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.resetPassword = (emailAddress) => {
    return new Promise((resolve, reject) => {
        if (!emailAddress) {
            reject();

            return;
        }

        if (auth.currentUser) {
            reject();

            return;
        }

        auth.sendPasswordResetEmail(emailAddress)
            .then((value) => {
                analytics.logEvent("reset_password");

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.changeAvatar = (avatar) => {
    return new Promise((resolve, reject) => {
        if (!avatar) {
            reject();

            return;
        }

        const avatarFileTypes = [
            "image/gif",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml",
        ];

        if (!avatarFileTypes.includes(avatar.type)) {
            reject();

            return;
        }

        if (avatar.size > 20 * 1024 * 1024) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        const avatarReference = storage
            .ref()
            .child("images")
            .child(uid)
            .child(uid);
        // .child("avatars");

        avatarReference
            .put(avatar)
            .then((uploadTaskSnapshot) => {
                avatarReference
                    .getDownloadURL()
                    .then((value) => {
                        currentUser.updateProfile({
                            photoURL: value,
                        });
                        database
                            .ref("user")
                            .child(uid)
                            .child("profile")
                            .once("value", (k) => {
                                // console.log("1", k);
                                // console.log("2", k.key);
                                let values = k.val();
                                let profileId = Object.keys(k.val())[0];
                                // let firstName = values[profileId].fname;

                                console.log("id", profileId);
                                console.log("url", value);
                                database
                                    .ref("user")
                                    .child(uid)
                                    .child("profile")
                                    .child(profileId)
                                    .update({
                                        photo: value,
                                    })
                                    .then((value) => {
                                        analytics.logEvent("change_avatar");

                                        resolve(value);
                                    })
                                    .catch((reason) => {
                                        reject(reason);
                                    });
                            })

                            .catch((reason) => {
                                reject(reason);
                            });
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

authentication.removeAvatar = () => {
    return new Promise((resolve, reject) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        currentUser
            .updateProfile({
                photoURL: null,
            })
            .then((value) => {
                const avatarReference = storage
                    .ref()
                        .child("images")
                        .child(uid)
                        .child(uid);

                avatarReference
                    .delete()
                    .then((value) => {
                        analytics.logEvent("remove_avatar");

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

authentication.changeFirstName = (firstName) => {
    return new Promise((resolve, reject) => {
        if (!firstName) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        const userDocumentReference = firestore.collection("users").doc(uid);

        userDocumentReference.update({
            firstName: firstName,
        });

        database
            .ref("user")
            .child(uid)
            .child("profile")
            .once("value", (k) => {
                // console.log("1", k);
                // let values = k.val();
                let profileId = Object.keys(k.val())[0];
                // console.log("2", k.key);
                // console.log("3", values[profileId].fname);
                // console.log("3", values);
                // console.log("id", profileId);
                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .child(profileId)
                    .update({ fname: firstName })
                    .then((value) => {
                        analytics.logEvent("change_first_name");

                        resolve(value);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            });
    });
};

authentication.changeLastName = (lastName) => {
    return new Promise((resolve, reject) => {
        if (!lastName) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        const userDocumentReference = firestore.collection("users").doc(uid);

        userDocumentReference.update({
            lastName: lastName,
        });

        database
            .ref("user")
            .child(uid)
            .child("profile")
            .once("value", (k) => {
                // console.log("1", k);
                // console.log("2", k.key);
                let values = k.val();
                let profileId = Object.keys(k.val())[0];
                let firstName = values[profileId].fname;

                console.log("id", profileId);
                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .child(profileId)
                    .update({
                        phone: lastName,
                    })
                    .then((value) => {
                        analytics.logEvent("change_first_name");

                        resolve(value);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            });
    });
};

authentication.changeUsername = (username) => {
    return new Promise((resolve, reject) => {
        if (!username) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        const userDocumentReference = firestore.collection("users").doc(uid);

        userDocumentReference.update({
            username: username,
        });
        database
            .ref("user")
            .child(uid)
            .child("profile")
            .once("value", (k) => {
                // console.log("1", k);
                // console.log("2", k.key);
                let values = k.val();
                let profileId = Object.keys(k.val())[0];
                let firstName = values[profileId].fname;

                console.log("id", profileId);
                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .child(profileId)
                    .update({
                        username: username,
                    })
                    .then((value) => {
                        analytics.logEvent("change_first_name");

                        resolve(value);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            });
    });
};

authentication.changeEmailAddress = (emailAddress) => {
    return new Promise((resolve, reject) => {
        if (!emailAddress) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        currentUser.updateEmail(emailAddress);
        database
            .ref("user")
            .child(uid)
            .child("profile")
            .once("value", (k) => {
                // console.log("1", k);
                // console.log("2", k.key);
                let values = k.val();
                let profileId = Object.keys(k.val())[0];

                console.log("id", profileId);
                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .child(profileId)
                    .update({
                        email: emailAddress,
                    })
                    .then((value) => {
                        analytics.logEvent("change_email_address");

                        resolve(value);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
            });
    });
};

authentication.changePassword = (password) => {
    return new Promise((resolve, reject) => {
        if (!password) {
            reject();

            return;
        }

        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        const uid = currentUser.uid;

        if (!uid) {
            reject();

            return;
        }

        currentUser
            .updatePassword(password)
            .then((value) => {
                const userDocumentReference = firestore
                    .collection("users")
                    .doc(uid);

                userDocumentReference.update({
                    lastPasswordChange: firebase.firestore.FieldValue.serverTimestamp(),
                });

                let profId;

                const setProfileId = (id) => (profId = id);
                database
                    .ref("user")
                    .child(uid)
                    .child("profile")
                    .once("value", (k) => {
                        // console.log("1", k);
                        // console.log("2", k.key);
                        // let values = k.val();
                        let profileId = Object.keys(k.val())[0];
                        setProfileId(profileId);
                        console.log("id", profileId);
                        database
                            .ref("user")
                            .child(uid)
                            .child("profile")
                            .child(profileId)
                            .update({
                                lastPasswordChange:
                                    firebase.database.ServerValue.TIMESTAMP,
                            })
                            .then((value) => {
                                analytics.logEvent("change_password");

                                resolve(value);
                            })
                            .catch((reason) => {
                                reject(reason);
                            });
                    })
                    .then((value) => {
                        analytics.logEvent("change_password");

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

authentication.verifyEmailAddress = () => {
    return new Promise((resolve, reject) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        currentUser
            .sendEmailVerification()
            .then((value) => {
                analytics.logEvent("verify_email_address");

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.deleteAccount = () => {
    return new Promise((resolve, reject) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        currentUser
            .delete()
            .then((value) => {
                analytics.logEvent("delete_account");

                resolve(value);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.getRoles = () => {
    return new Promise((resolve, reject) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            reject();

            return;
        }

        currentUser
            .getIdTokenResult()
            .then((idTokenResult) => {
                resolve(idTokenResult.claims.roles);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.isAdmin = () => {
    return new Promise((resolve, reject) => {
        authentication
            .getRoles()
            .then((value) => {
                resolve(value.includes("admin"));
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.isPremium = () => {
    return new Promise((resolve, reject) => {
        authentication
            .getRoles()
            .then((value) => {
                resolve(value.includes("premium"));
            })
            .catch((reason) => {
                reject(reason);
            });
    });
};

authentication.getName = (fields) => {
    if (!fields) {
        return null;
    }

    const firstName = fields.firstName;
    const username = fields.username;
    const displayName = fields.displayName;
    const lastName = fields.lastName;

    if (firstName) {
        return firstName;
    }

    if (username) {
        return username;
    }

    if (displayName) {
        return displayName;
    }

    if (lastName) {
        return firstName;
    }

    return null;
};

authentication.getFullName = (fields) => {
    if (!fields) {
        return null;
    }

    const firstName = fields.firstName;
    const lastName = fields.lastName;
    const displayName = fields.displayName;

    if (firstName && lastName) {
        return `${firstName}`;
    }

    if (displayName) {
        return displayName;
    }

    return null;
};

authentication.getNameInitials = (fields) => {
    if (!fields) {
        return null;
    }

    const firstName = fields.firstName;
    const lastName = fields.lastName;
    const username = fields.username;
    const displayName = fields.displayName;

    if (firstName && lastName) {
        let name = firstName.split(" ");
        if (name.length > 1) {
            return name[0][0] + name[1][0];
        } else {
            return firstName.charAt(0);
        }
    }

    if (firstName) {
        return firstName.charAt(0);
    }

    if (username) {
        return username.charAt(0);
    }

    if (lastName) {
        return firstName.charAt(0);
    }

    if (displayName) {
        return displayName.charAt(0);
    }

    return null;
};

authentication.getProfileCompletion = (fields) => {
    if (!fields) {
        return null;
    }

    fields = [
        fields.photoURL,
        fields.firstName,
        fields.lastName,
        fields.username,
        fields.email,
        fields.email && fields.emailVerified,
    ];

    if (!fields) {
        return null;
    }

    let profileCompletion = 0;

    fields.forEach((field) => {
        if (field) {
            profileCompletion += 100 / fields.length;
        }
    });

    return Math.floor(profileCompletion);
};

authentication.getSecurityRating = (user, userData) => {
    if (!user || !user.metadata) {
        return null;
    }

    let creationTime = user.metadata.creationTime;

    if (!creationTime) {
        return null;
    }

    creationTime = moment(creationTime);

    let securityRating = 0;

    if (userData && userData.lastPasswordChange) {
        let lastPasswordChange = userData.lastPasswordChange;

        if (lastPasswordChange) {
            lastPasswordChange = moment(lastPasswordChange.toDate());

            if (creationTime.diff(lastPasswordChange, "days") >= 365.242199) {
                securityRating = 50;
            } else {
                securityRating = 100;
            }
        }
    } else {
        if (moment().diff(creationTime, "days") >= 365.242199) {
            securityRating = 50;
        } else {
            securityRating = 100;
        }
    }

    return securityRating;
};

export default authentication;
