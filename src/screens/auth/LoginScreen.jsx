import { useState } from 'react';
import { View, TextInput,  Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setEmail } from '../../store/slices/authSlice';
import { useLoginMutation } from '../../services/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../global/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      const res = await login({ email, password }).unwrap();
     
      await AsyncStorage.setItem('auth', JSON.stringify({
        email: res.email,
        idToken: res.idToken,
        refreshToken: res.refreshToken,
        localId: res.localId,
      }));
      dispatch(setEmail(res.email));           
    } catch (e) {
     
      console.log('Auth error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>My Gym Tracker</Text>
          <Text style={styles.appSubtitle}>Tu entrenamiento, más efectivo</Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor={colors.mediumGray}
            autoCapitalize="none" 
            keyboardType="email-address"
            onChangeText={setEmailInput} 
            value={email}
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Contraseña" 
            placeholderTextColor={colors.mediumGray}
            secureTextEntry 
            onChangeText={setPassword} 
            value={password}
          />
          
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              isLoading && styles.disabledButton
            ]} 
            onPress={onSubmit} 
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
          
          {!!error && (
            <Text style={styles.errorText}>
              {error?.data?.error?.message || 'Error de autenticación'}
            </Text>
          )}
          
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGray,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    width: '100%',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: colors.black,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: colors.mediumGray,
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.danger,
    marginTop: 16,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: colors.lightGray,
    fontSize: 14,
  },
});
