import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import Expo from "expo";

const languageDetector = {
    type: "languageDetector",
    async: true, // flags below detection to be async
    detect: (cb) => {
        return Expo.Util.getCurrentLocaleAsync()
            .then(lng => { cb(lng.split("_")[0]); });

    },
    // tslint:disable-next-line:no-empty
    init: () => { },
    // tslint:disable-next-line:no-empty
    cacheUserLanguage: () => { }
};

i18n
    .use(reactI18nextModule)
    .use(languageDetector)
    .init({
        fallbackLng: "en",
        resources: {
            en: {
                translation: {
                    home: {
                        header: "Home",
                        quote: "It's the challenge that makes the greatness.",
                        alreadyRegistered: "Already a member?",
                        signupButton: "SIGN UP",
                        signinLink: "Sign In"
                    },
                    profile: {
                        header: "Profile",
                        updateProfile: "Update Profile",
                        changePassword: "Change Password",
                        privacy: "Privacy",
                        impress: "Impress",
                        logout: "Logout",
                        deleteUser: "Delete User"
                    },
                    signIn: {
                        header: "Sign In",
                        emailPlaceholder: "Email",
                        pwdPlaceholder: "Password",
                        signinButton: "SIGN IN",
                        notAMember: "Not a member yet?",
                        signupLink: "Sign Up",
                        forgotPwd: "Forgot your password?",
                        forgotPwdLink: "Help",
                        emailToShort: "Email must have at least 5 characters",
                        pwdToShort: "Password must have at least 6 characters",
                        userDisabled: "This user is disabled",
                        invalidLogin: "Invalid email or password",
                        unexpectedError: "An unexpected error happened"
                    },
                    signUp: {
                        header: "Sign Up",
                        namePlaceholder: "Full Name",
                        emailPlaceholder: "Email",
                        pwdPlaceholder: "Password",
                        alreadyRegistered: "Already a member?",
                        signupButton: "SIGN UP",
                        signinLink: "Sign In",
                        nameToShort: "Name must have at least 3 characters",
                        emailToShort: "Email must have at least 5 characters",
                        pwdToShort: "Password must have at least 6 characters",
                        userAlreadyExists: "Email already exists",
                        invalidEmail: "Email is invalid",
                        pwdToWeak: "Password is to weak",
                        unexpectedError: "An unexpected error happened"
                    },
                    forgotPwd: {
                        header: "Reset Password",
                        emailPlaceholder: "Email",
                        resetPwdButton: "RESET PASSWORD",
                        signinText: "Bring me back to",
                        signinLink: "Sign In",
                        emailToShort: "Email must have at least 5 characters",
                        unexpectedError: "An unexpected error happened",
                        emailHint: "An email with intructions to reset your password was sent to you. Please check your inbox."
                    },
                    deleteUser: {
                        currentPwdPlaceholder: "Current Password",
                        deleteUserHint: "Please enter your current password in order to delete your user. Note that deleting your user is irreversibly and all data associated with your account will be lost.",
                        deleteUserButton: "DELETE USER",
                        wrongPwd: "The password entered does not match your curent password",
                        unexpectedError: "An unexpected error happened",
                    },
                    logout: {
                        logoutHint: "Are you sure you want to logut?",
                        logoutButton: "LOGOUT"
                    },
                    resetPwd: {
                        currentPwdPlaceholder: "Current Password",
                        newPwdPlaceholder: "New Password",
                        resetPwdButton: "RESET",
                        pwdToShort: "Password must have at least 6 characters",
                        wrongPwd: "The password entered does not match your curent password",
                        newPwdToWeak: "New password is to weak",
                        unexpectedError: "An unexpected error happened",
                    },
                    updateProfile: {
                        namePlaceholder: "Full Name",
                        emailPlaceholder: "Email",
                        updateProfileButton: "UPDATE",
                        nameToShort: "Name must have at least 3 characters",
                        emailToShort: "Email must have at least 5 characters",
                        userAlreadyExists: "Email already exists",
                        invalidEmail: "Email is invalid",
                        unexpectedError: "An unexpected error happened"
                    },
                    createItem: {
                        header: "Add Item",
                        createItemButton: "ADD ITEM",
                        descToShort: "Description must be at least 3 characters long",
                        invalidDateRange: "Invalid date range provided. Make sure start date is before end date",
                        unexpectedError: "An unexpected error happened",
                        loadingIndicator: "Creating Item",
                        descPlaceholder: "Description",
                        datePickerStartPlaceholder: "Start Date",
                        datePickerEndPlaceholder: "End Date",
                        datePickerConfirm: "Confirm",
                        datePickerCancel: "Cancel",
                    },
                    patchItem: {
                        header: "Update Item",
                        descToShort: "Description must be at least 3 characters long",
                        invalidDateRange: "Invalid date range provided. Make sure start date is before end date",
                        unexpectedError: "An unexpected error happened",
                        updateItemButton: "UPDATE ITEM",
                        loadingIndicator: "Updating Item",
                        datePickerConfirm: "Confirm",
                        datePickerCancel: "Cancel",
                    },
                    sortItems: {
                        sortByName: "Name",
                        sortByDate: "Date",
                        sortByDuration: "Duration"
                    },
                    deleteItem: {
                        deleteButton: "DELETE",
                        deleteHint: "Delete Item {{itemName}}?"
                    },
                    itemStats: {
                        total: "Total",
                        average: "Average",
                        min: "Min",
                        max: "Max",
                        items: "Items"
                    },
                    itemList: {
                        date: "Date",
                        duration: "Duration"
                    },
                    items: {
                        welcome: "{{taskName}} sounds like an awesome task!",
                        getStarted: " Add your first item to it by clicking on the + sign on the top right corner."
                    }
                }
            },
            de: {
                translation: {
                    home: {
                        header: "Home",
                        quote: "Man wächst mit seinen Aufgaben",
                        alreadyRegistered: "Bereits registriert?",
                        signupButton: "REGISTRIEREN",
                        signinLink: "Anmelden"
                    },
                    profile: {
                        header: "Profil",
                        updateProfile: "Profil ändern",
                        changePassword: "Passwort ändern",
                        privacy: "Datenschutz",
                        impress: "Impressum",
                        logout: "Logout",
                        deleteUser: "User löschen"
                    },
                    signIn: {
                        header: "Anmelden",
                        emailPlaceholder: "Email",
                        pwdPlaceholder: "Passwort",
                        signinButton: "ANMELDEN",
                        notAMember: "Noch kein Mitglied?",
                        signupLink: "Registrieren",
                        forgotPwd: "Passwort vergessen?",
                        forgotPwdLink: "Hilfe",
                        emailToShort: "Email muss aus mindestens 5 Zeichen bestehen",
                        pwdToShort: "Password muss aus mindestens 6 Zeichen bestehen",
                        userDisabled: "Dieser User ist gesperrt",
                        invalidLogin: "Unültige Email oder Passwort",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten"
                    },
                    signUp: {
                        header: "Registrieren",
                        namePlaceholder: "Dein Name",
                        emailPlaceholder: "Email",
                        pwdPlaceholder: "Passwort",
                        alreadyRegistered: "Bereits registriert?",
                        signupButton: "REGISTRIEREN",
                        signinLink: "Anmelden",
                        nameToShort: "Name muss aus mindestens 3 Zeichen bestehen",
                        emailToShort: "Email muss aus mindestens 5 Zeichen bestehen",
                        pwdToShort: "Password muss aus mindestens 6 Zeichen bestehen",
                        userAlreadyExists: "Email bereits in Verwendung",
                        invalidEmail: "Ungültige Email",
                        pwdToWeak: "Zu schwaches Passwort",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten"
                    },
                    forgotPwd: {
                        header: "Passwort zurücksetzen",
                        emailPlaceholder: "Email",
                        resetPwdButton: "NEUES PASSWORT",
                        signinText: "Zurück zur",
                        signinLink: "Anmeldung",
                        emailToShort: "Email muss aus mindestens 5 Zeichen bestehen",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
                        emailHint: "Dir wurde soeben eine Email zum zurücksetzen deines Passworts gesendet."
                    },
                    deleteUser: {
                        currentPwdPlaceholder: "Aktuelles Passwort",
                        deleteUserHint: "Bitte gib dein aktuelles Passwort ein um deinen User zu löschen. Bitte berücksichtige das dieser Vorgang nicht rückgängig gemacht werden kann und alle deine Daten gelöscht werden.",
                        deleteUserButton: "LÖSCHEN",
                        wrongPwd: "Das eingegebene Passwort stimmt nicht mit deinen aktuellen überein",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
                    },
                    logout: {
                        logoutHint: "Bist du sicher, dass du dich ausloggen möchtest?",
                        logoutButton: "LOGOUT"
                    },
                    resetPwd: {
                        currentPwdPlaceholder: "Aktuelles Passwort",
                        newPwdPlaceholder: "Neues Passwort",
                        resetPwdButton: "RESET",
                        pwdToShort: "Password muss aus mindestens 6 Zeichen bestehen",
                        wrongPwd: "Das eingegebene Passwort stimmt nicht mit deinen aktuellen überein",
                        newPwdToWeak: "Das neue Passwort ist zu schwach",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
                    },
                    updateProfile: {
                        namePlaceholder: "Dein Name",
                        emailPlaceholder: "Email",
                        updateProfileButton: "UPDATE",
                        nameToShort: "Name muss aus mindestens 3 Zeichen bestehen",
                        emailToShort: "Email muss aus mindestens 5 Zeichen bestehen",
                        userAlreadyExists: "Email bereits in Verwendung",
                        invalidEmail: "Ungültige Email",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten"
                    },
                    createItem: {
                        header: "Item hinzufügen",
                        createItemButton: "HINZUFÜGEN",
                        descToShort: "Beschreibung muss aus mindestens 3 Zeichen bestehen",
                        invalidDateRange: "Ungültiger Zeitraum. Stell sicher dass das Start-Datum vor dem End-Datum liegt.",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
                        loadingIndicator: "Item wird hinzugefügt",
                        descPlaceholder: "Beschreibung",
                        datePickerStartPlaceholder: "Start-Datum",
                        datePickerEndPlaceholder: "End-Datum",
                        datePickerConfirm: "Ok",
                        datePickerCancel: "Abbrechen",
                    },
                    patchItem: {
                        header: "Item ändern",
                        descToShort: "Beschreibung muss aus mindestens 3 Zeichen bestehen",
                        invalidDateRange: "Ungültiger Zeitraum. Stell sicher dass das Start-Datum vor dem End-Datum liegt.",
                        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
                        updateItemButton: "ÄNDERN",
                        loadingIndicator: "Item wird hinzugefügt",
                        datePickerConfirm: "Ok",
                        datePickerCancel: "Abbrechen",
                    },
                    sortItems: {
                        sortByName: "Name",
                        sortByDate: "Datum",
                        sortByDuration: "Dauer"
                    },
                    deleteItem: {
                        deleteButton: "LÖSCHEN",
                        deleteHint: "Item {{itemName}} löschen?"
                    },
                    itemStats: {
                        total: "Gesamt",
                        average: "Durchschnitt",
                        min: "Min",
                        max: "Max",
                        items: "Items"
                    },
                    itemList: {
                        date: "Datum",
                        duration: "Dauer"
                    },
                    items: {
                        welcome: "{{taskName}} hört sich nach einen tollen Task an!",
                        getStarted: " Füge dein erstes Item hinzu, indem du auf den + Button oben rechts klickst."
                    }
                }
            },
            ns: ["common"],
            defaultNS: "common",
            debug: true,
            // cache: {
            //   enabled: true
            // },            
            interpolation: {
                escapeValue: false // not needed for react
            }
        }
    });

export default i18n;
