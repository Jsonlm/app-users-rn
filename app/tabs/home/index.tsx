import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  ToastAndroid,
  Button,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomModal from "@/app/shared-components/custom-modal";

type RootStackParamList = {
  edit: { nombre: string };
};

const DATA = [
  {
    title: 'Usuarios',
    data: ['Pedro Armando Perez', 'Anibal Ruiz Soto', 'Camilo Alvarez Muñoz'],
  }
];

const DATA2 = [
  { nombre: 'Jeisson Lenis', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 21 },
  { nombre: 'Jorge Aguilar', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 22 },
  { nombre: 'Alejandro Solo Nieto', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 23 },
  { nombre: 'Natalia Cañar', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 24 },
  { nombre: 'Alba Nidia Lopez', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 27 },
  { nombre: 'Diana Rios', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 27 },
  { nombre: 'Paola Tillmans', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 27 },
  { nombre: 'Carolina Torres Castillo', email: 'jlenis@gmail.com', fechanacimiento: '', edad: 27 }
];

AsyncStorage.setItem('titleList', JSON.stringify(DATA[0].title));

export default function Index() {
  const [users, setUsers] = useState<any[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    navigation.setOptions({ title: `Bienvenido ${'Gustavo Duque'}` });

    // Cargar datos al iniciar
    const loadUsers = async () => {
      try {
        const storageValue = await AsyncStorage.getItem('localStorageArray');
        if (storageValue) {
          setUsers(JSON.parse(storageValue));
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    loadUsers();
  }, []);

  const onDelete = async (nombre: string) => {
    try {
      const storageValue = await AsyncStorage.getItem('localStorageArray');

      if (!storageValue) {
        ToastAndroid.show(`No hay datos en AsyncStorage.`, ToastAndroid.SHORT);
        return;
      }

      const list: any[] = JSON.parse(storageValue);
      const filteredUsers = list.filter(user => user.nombre !== nombre);

      await AsyncStorage.setItem('localStorageArray', JSON.stringify(filteredUsers));
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const onCreate = () => {
    AsyncStorage.setItem("nombreEdit", "");
    AsyncStorage.setItem('edit', String(false));
    setTimeout(() => {
      navigation.navigate("edit", { nombre: "" });
    }, 1000);
  }

  // Reestructurar los datos para SectionList
  const sections = [
    {
      title: 'Usuarios',
      data: users.map((user) => user.nombre),
    },
  ];

  return (
    <SafeAreaProvider style={styles.listView}>
      <LinearGradient
        colors={['#550f6b', '#e0c9e9']}
        style={styles.linearGradient}
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 0.5, y: 1.0 }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Iniciar sesión
        </Text>
        <SafeAreaView style={styles.container} edges={['top']}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => <SwipeableCard nombre={item} onDelete={onDelete} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
                {title}
              </Text>
            )}
          />
        </SafeAreaView>
      </LinearGradient>
      <Button title="add" onPress={() => { onCreate() }} />

    </SafeAreaProvider>
  );
}

const SwipeableCard = ({ nombre, onDelete }: { nombre: string; onDelete: (nombre: string) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const translateX = new Animated.Value(0);
  const [showOptions, setShowOptions] = useState(false);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX < -80) {
        Animated.timing(translateX, {
          toValue: -100, // Mover la card para mostrar opciones
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowOptions(true));
      } else {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowOptions(false));
      }
    }
  };
  const onEdit = () => {
    AsyncStorage.setItem("nombreEdit", nombre);
    showSpinner();
    setTimeout(() => {
      navigation.navigate("edit", { nombre });
    }, 1000);
  };


  const showSpinner = () => {
    console.log("cargando");

  }
  return (
    <><GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.swipeContainer}>
        {/* Opciones ocultas detrás de la tarjeta */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText} onPress={() => {
              onEdit();
            }
            }>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => setShowModal(true)}>
            <Text style={styles.optionText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[styles.item, { transform: [{ translateX }] }]}>
            <LinearGradient
              colors={['#550f6b', '#b564cf']}
              style={styles.linearGradient}
              start={{ x: 0, y: 0.25 }}
              end={{ x: 0.75, y: 1 }}
            >
              <Text style={styles.title}>{nombre}</Text>
            </LinearGradient>
          </Animated.View>
        </PanGestureHandler>
      </View></GestureHandlerRootView>
      {/* Modal para confirmar eliminación */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          onDelete(nombre);
          setShowModal(false);
        }}
        message={`¿Estás seguro de eliminar a ${nombre}?`}
      />
    </>

  );
};

const styles = StyleSheet.create({
  listView: {
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '#c78ac38f',
  },
  container: {
    backgroundColor: '#e0c9e9',
    borderRadius: 10,
    flex: 1,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10
  },
  swipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 2,
  },
  item: {
    borderRadius: 13,
    height: 100,
    justifyContent: 'space-around',
    width: '100%',
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10
  },
  title: {
    color: '#fff',
    fontSize: 24,
  },
  optionsContainer: {
    position: 'absolute',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-around',
    right: 0,
    height: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#621c79',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    width: 80
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
