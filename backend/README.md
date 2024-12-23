###### Nombre: Katherine Nayelhi Flores Figueroa
###### Clave : GDA00560-OT

> .[!TIP].
> **Cómo configurar el archivo `.env`:**
> Variables utilizadas:
>    ```env
>    DB_NAME=GDA00560OT_KatherineFlores
>    DB_USER
>    DB_PASSWORD
>    DB_HOST
>    PORT
>    JWT_SECRET
>    JWT_EXPIRATION=24h
>    ```

## ENDPOINTS

1. Crear una Orden
    Método: POST
    URL: /api/orden
    Body: raw - JSON
    Campos Obligatorios: usuario, correo, fecha_entrega y detalles
    Ejemplo del JSON:
    {
        "usuario": 6,
        "nombre": "Juan Perez",
        "direccion": "Calle Principal, Puerto Barrios, Izabal",
        "telefono": "50287964481",
        "correo": "juanp@example.com",
        "fecha_entrega": "2024-12-25",
        "detalles": [
            {
            "productos_idProductos": 1,
            "cantidad": 2
            },
            {
            "productos_idProductos": 6,
            "cantidad": 1
            },
            {
            "productos_idProductos": 8,
            "cantidad": 2
            }
        ]
    }

2. Obtener todas las ordenes
    Método: GET
    URL: /api/ordenes

3. Obtener una orden por ID
    Método: GET
    URL: /api/orden/{id_de_la_orden}

4. Cancelar una orden
    Método: PUT
    URL: /api/cancelar/orden/{id_de_la_orden}

5. Cambiar el estado de una orden
    Método: PUT
    URL: /api/cambiar-estado/orden/{id_de_la_orden}
    Body: raw - JSON
    Ejemplo del JSON:
    {
        "estado": 6
    }

6. Actualizar los datos de una orden
    Método: PUT
    URL: /api/orden/{id_de_la_orden}
    Body: raw - JSON
    Ejemplo del JSON:
    {
        "detalles": [
            {
            "productos_idProductos": 1,
            "cantidad": 4
            },
            {
            "productos_idProductos": 6,
            "cantidad": 2
            },
            {
            "productos_idProductos": 8,
            "cantidad": 1
            }
        ]
    }

7. Crear un nuevo cliente
    Método: POST
    URL: /api/cliente
    Body: raw - JSON
    Campos Obligatorios: nit y correo
    Ejemplo del JSON:
    {
        "razon_social": "Comercial XYZ S.A.",
        "nombre_comercial": "XYZ Tienda",
        "nit": "123456789",
        "direccion_entrega": "Avenida Central 456, Zona 10, Ciudad",
        "telefono": "50248489675",
        "correo": "contacto@xyztienda.com"
    }

8. Obtener todos los clientes
     Método: GET
    URL: /api/clientes

9. Obtener un cliente por ID
    Método: GET
    URL: /api/cliente/{id_del_cliente}

10. Actualizar los datos de un cliente
    Método: PUT
    URL: /api/cliente/{id_del_cliente}
    Body: raw - JSON
    Ejemplo del JSON:
    {
        "direccion_entrega": "Puerto Barrios, Izabal"
    }

11. Crear categoria de productos
    Método: POST
    URL: /api/categoria
    Body: raw - JSON
    Campos Obligatorios: nombre
    Ejemplo del JSON:
    {
        "usuario": 6,
        "estado": 1,
        "nombre": "Cereales integrales"
    }

12. Obtener todas las categorias
    Método: GET
    URL: /api/categorias

13. Obtener una categoria por ID o filtrarla por Estado
    Método: GET
    URL: /api/categoria
    Params: {
                estado,  
                idCategoria
            }

14. Actualizar una categoria
    Método: PUT
    URL: /api/categoria/{id_de_la_categoria}
    Body: raw - JSON
    Ejemplo del JSON:
    {
        "nombre": "Frutas y Verduras"
    }

15. Inhabilitar una categoria
    Método: PUT
    URL: /api/deshabilitar/categoria/{id_de_la_categoria}

16. Crear un Producto
    Método: POST
    URL: /api/producto
    Body: form-data
    Campos obligatorios: nombre, stock y precio
    Ejemplo:
    Key: categoriaProductos| Type: Text | Value: 1 
    Key: usuario           | Type: Text | Value: 6 
    Key: estado            | Type: Text | Value: 1 
    Key: nombre            | Type: Text | Value: Medallones de Pollo 
    Key: descripcion       | Type: Text | Value: ¡Abre, calienta, sirve y disfruta con los deliciosos medallones de Pollo Rey!  
    Key: marca             | Type: Text | Value: Pollo Rey 
    Key: codigo            | Type: Text | Value: ALC002 
    Key: stock             | Type: Text | Value: 20 
    Key: precio            | Type: Text | Value: 33.40 
    Key: foto              | Type: File | Value: [imagen.jpg] 

17. Obtener todos los productos
    Método: GET
    URL: /api/productos

18. Obtener un producto por ID o filtrar por categoria, estado, nombre, marca, codigo, precio minimo y maximo, stock minimo y maximo y ordenar por Precio o Stock y Ascendente o Descendente.
    Método: GET
    URL: /api/producto
    Params: {
                idProductos,
                categoria,
                estado,
                nombre,
                marca,
                codigo,
                precioMin,
                precioMax,
                stockMin,
                stockMax,
                ordenarPor,
                orden
            }
    Ejemplo:
    Key: precioMin     | Value: 30
    Key: precioMax     | Value: 50
    Key: ordenarPor    | Value: Precio
    Key: orden         | Value: DESC

19. Actualizar un Producto
    Método: PUT
    URL: /api/producto/{id_del_producto}
    Body: form-data


20. Inhabilitar un Producto
    Método: PUT
    URL: /api/deshabilitar/producto/{id_del_producto}

21. Crear un Usuario
    Método: POST
    URL: /api/usuario
    Body: raw - JSON
    Campos obligatorios: rol, nombre, correo, password, y fecha de nacimiento
    Ejemplo del JSON:
    {
        "rol": 2,
        "estado":  1,
        "cliente": 2,
        "nombre": "El Sol",
        "correo": "elsol@gmail.com",
        "password": "elsol1234",
        "telefono": "+50279225845",
        "fecha_nacimiento": "1997-11-09"
    }


22. Obtener todos los Usuarios
    Método: GET
    URL: /api/usuarios

23. Obtener un usuario por ID
    Método: GET
    URL: /api/usuario/{id_del_usuario}

24. Actualizar un usuario
    Método: PUT
    URL: /api/usuario/{id_del_usuario}
    Body: raw - JSON

25. Deshabilitar un usuario
    Método: PUT
    URL: /api/deshabilitar/usuario/{id_del_usuario}

26. Actualizar el password de un usuario
    Método: PUT
    URL: /api/actualizar-password/usuario/{id_del_usuario}
    Body: raw - JSON
    Campos obligatorios: password actual y nueva
    Ejemplo del JSON:
    {
        "passwordActual": "elsol1234",
        "nuevoPassword": "elsol1997"
    }

27. Login
    Método: POST
    URL: /api/login
    Body: raw - JSON
    Campos obligatorios: rol, correo y password
    Ejemplo del JSON:
    {
        "rol": 2,
        "correo": "elsol@gmail.com",
        "password": "elsol1997"
    }

28. Logout
    Método: POST
    URL: /api/logout
