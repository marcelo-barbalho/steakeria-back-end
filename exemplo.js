const home_content = {
    banner =[
        {
            product_banner_photo = "",
            product = fk,
            direction = "L|R",
            order = 1
        }
    ],
    infos =[
        {
            icon: "",
            text: "",
            link: "",
            order = 1
        }
    ],
    about = {
        photo: "",
        title: "",
        description: "",
        direction = "L|R"
    },
    component_services = {
        title: "",
        description: "",
        service =[
            {
                photo: "",
                description: "",
                order = 1
            }
        ]
    }
}

//regra de negocio de discount price nao ser mais de 10%
const product = {
    photo: "",
    title: "",
    category: fk,
    highlight: Boolean,
    description: "",
    complete_description: "",
    price: "",
    discount_price: "",
    discount_price_percent: "",
    last_modified_by: user_fk,
    last_modification_date: Date,
    status: Boolean
}

const category = {
    icon: "",
    name: "",
    status: Boolean
}

const user = {
    email: "",
    password: ""
}
