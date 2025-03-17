import { Formik } from 'formik';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
    index: undefined;
};

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={{ padding: 20 }}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={values => {
                    const errors: { email?: string; password?: string } = {};
                    if (!values.email) {
                        errors.email = 'Requerido';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Formato Incorrecto';
                    }
                    if (!values.password) errors.password = 'Requerido';
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                    navigation.navigate('index');
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 400);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Inicio de sesión</Text>

                        {/* Input de Email */}
                        <TextInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                borderRadius: 5,
                                marginBottom: 5,
                            }}
                        />
                        {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

                        {/* Input de Password */}
                        <TextInput
                            placeholder="Contraseña"
                            secureTextEntry
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                borderRadius: 5,
                                marginBottom: 5,
                            }}
                        />
                        {errors.password && touched.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

                        {/* Botón */}
                        <TouchableOpacity
                            onPress={() => handleSubmit()}
                            disabled={isSubmitting}
                            style={{
                                backgroundColor: '#3c3c3c',
                                padding: 15,
                                borderRadius: 5,
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Iniciar sesión</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
}
