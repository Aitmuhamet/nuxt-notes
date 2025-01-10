export default function ({ route, redirect }) {
    const id = route.params.id;
  
    // Если ID отсутствует, перенаправить на главную
    if (!id) {
      return redirect('/');
    }
  
    console.log(`Переход на маршрут с ID: ${id}`);
  }
  