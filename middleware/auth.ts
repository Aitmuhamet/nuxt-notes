export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();
    if (user && to.name === "login") {
        navigateTo("/");
    }
    if (!user && to.name !== 'login') {
        navigateTo('/login');
    }
});
