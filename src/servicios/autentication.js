import { auth } from '@/firebase/config.js'
import { ref } from 'vue'

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification

} from 'firebase/auth'


// variable global del usuario
const usuario = ref(null)

//escuchar cambios de la autenticacion
onAuthStateChanged(auth, (userFirebase) => {
    console.log("Auth: usuario detectado - ", userFirebase?.email || "Anonimo")
    usuario.value = userFirebase
})

//registrar usuario

export const registrar = async (email, password) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Usuario creado correctamente ✅', email);
        return {
            ok: true,
            mensaje: 'usuario creado correctamente',
            usuario: userCredentials
        }
    } catch (error) {
        console.log('Error verifique los datos ❌', error);
        return {
            ok: false,
            error: 'usuario no creado'
        }
    }
}

export const login = async (email, password) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log('Sesion iniciada ✅', email);
        console.log(userCredentials);
        return {
            ok: true,
            mensaje: 'Sesion iniciada correctamente',
            usuario: userCredentials
        }

    } catch (error) {
        console.log('Error verifique los datos ❌', error);
        return {
            ok: false,
            error: 'usuario no creado'
        }
    }
}

export const logout = async () => {
    try {
        await signOut(auth)
        console.log('✅Sesion cerrada')
        return {
            ok: true
        }
    } catch (error) {
        console.log('❌', error)
        return {
            ok: false
        }
    }
}

export const estaAutenticado = () => {
    return usuario.value !== null
}

//Obtener usuario, si existe

export const obtenerUsuario = () => {
    return usuario
}

export const enviarEmailVerificacion = async (usuarioActual = null) => {
    try {
        const usuario = usuarioActual || auth.currentUser
        if (usuario.emailVerified) {
            console.log("✅ email ya verificado")
            return {
                ok: true,
                message: 'Email verificado'
            }
        }
        await sendEmailVerification(usuario, { url: window.location.origin + '/perfil' })
        return {
            ok: true,
            message: 'Email de verificacion enviado'
        }
    } catch (error) {
        console.log("❌ error al enviar email de verificacion", error)
    }
}