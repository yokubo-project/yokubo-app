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
    .use(languageDetector)
    .use(reactI18nextModule)
    .init({
        fallbackLng: "de",
        resources: {
            en: {
                translation: {
                    home: {
                        alreadyRegistered: "Already a member?"
                    }
                }
            },
            de: {
                translation: {
                    home: {
                        alreadyRegistered: "Bereits registriert?"
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
