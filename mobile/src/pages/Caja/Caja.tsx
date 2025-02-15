import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import "./Caja.css";
import db from "../../firebase.js";
import { update, ref } from "firebase/database";
import HeaderBar from "../../components/HeaderBar";
import { useCajaContext } from "../../contexts/CajaContext";
import { useUsuarioContext } from "../../contexts/UsuarioContext";
import { BarcodeScanner } from "@awesome-cordova-plugins/barcode-scanner";

interface barCode {
  [url: string]: number;
}

//ionic build
//npx cap add android
//export CAPACITOR_ANDROID_STUDIO_PATH=/snap/bin/android-studio
//npx cap open android

const Caja: React.FC = () => {
  const { user } = useUsuarioContext();
  const { setCaja } = useCajaContext();
  const [presentAlert] = useIonAlert();

  const openScanner = async () => {
    if (user !== "") {
      const data = await BarcodeScanner.scan();
      setCaja(Number(data.text));
      const obj: barCode = {};
      const url: string = `/sector1/personas/${user}/caja`;
      obj[url] = Number(data.text);
      update(ref(db), obj);
    } else {
      presentAlert({
        header: 'Importante',
        message: 'Debes ingresar tu nombre y apellido antes de escanear un QR',
        buttons: ['Perfecto'],
      })
    }
  };

  return (
    <IonPage>
      <HeaderBar name="Caja"/>
      <IonContent fullscreen>
        <IonButton
          class="B_registro"
          color="warning"
          expand="full"
          shape="round"
          onClick={openScanner}
        >
          Ingrese una Caja
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Caja;
