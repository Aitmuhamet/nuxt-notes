export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();
    console.log('user', user);
    

    if (user && to.name === "login") {
        console.group('auth.global.ts')
        console.log('/');
        console.groupEnd();
        navigateTo("/");
        
    }
    
    if (!user && to.name !== 'login') {
        console.group('auth.global.ts')
        console.log('/login');
        console.groupEnd();
        navigateTo('/login')
    }
});
