import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View, TextInput, TouchableOpacity, Platform, ToastAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  index: undefined;
};

type UserData = {
  nombre: string;
  email: string;
  // Agrega más campos si los tienes
};

export default function EditScreen() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [userData, setUserData] = useState<UserData | null>(null);

  const params = useLocalSearchParams() as { nombre?: string };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("localStorageArray");
        if (storedData) {
          const users = JSON.parse(storedData);
          console.log("Usuarios almacenados:", users);
          console.log("Parámetros recibidos:", params);

          // Buscar usuario con params.name
          const user = users.find((user: any) => user.nombre === params.nombre);
          if (user) {
            setUserData(user);
          } else {
            console.warn("Usuario no encontrado");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchUserData();
  }, [params]);


  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShow(false);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => showMode('date');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    navigation.setOptions({
      title: "Editar Usuario",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
          <Text style={{ color: 'blue' }}>⬅ Atrás</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Formik
        enableReinitialize
        initialValues={{
          email: userData ? userData.email : '',
          username: userData ? userData.nombre : '',
        }}
        validate={values => {
          const errors: { email?: string, username?: string } = {};

          if (!values.email) {
            errors.email = 'Requerido';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Formato Incorrecto';
          }

          if (!values.username) {
            errors.username = 'Requerido';
          } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(values.username)) {
            errors.username = 'Solo se permiten letras y espacios';
          } else if (/\s{2,}/.test(values.username)) {
            errors.username = 'No puede haber más de un espacio seguido';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          navigation.navigate("index");
          setTimeout(() => {
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
              Editar usuario
            </Text>

            <Text style={{ color: 'blue', marginBottom: 10 }}>Nombre completo</Text>
            <TextInput
              placeholder="Nombre completo - aquí"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              style={{ borderWidth: 1, padding: 10, marginBottom: 5, borderRadius: 5 }}
            />
            {errors.username && touched.username && (
              <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>
            )}

            <Text style={{ color: 'blue', marginBottom: 10 }}>Email</Text>
            <TextInput
              placeholder="Email - aquí"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={{ borderWidth: 1, padding: 10, marginBottom: 5, borderRadius: 5 }}
            />
            {errors.email && touched.email && (
              <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
            )}

            {Platform.OS === 'web' ? (
              <TextInput
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                value={date.toISOString().split('T')[0]}
                onChangeText={(e) => setDate(new Date(e))}
              />
            ) : (
              show && (
                <DateTimePicker
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )
            )}

            <Button
              onPress={showDatepicker}
              title="Seleccionar fecha"
            />
            <Text style={{ color: 'blue' }}>Fecha de nacimiento</Text>

            <Text style={{ marginTop: 10 }}>{date ? String(date.toLocaleString()) : "Fecha no disponible"}
            </Text>

            <TouchableOpacity
              onPress={() => handleSubmit}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#007bff',
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

    </SafeAreaView>
  );
}
