Seguindo o padrao de design da tela de home, crie aqui o modulo, um CRUD seguindo os melhores padroes da indrustra.
Crie um service na pasta app/services para as chamadas ao servidor (do proprio nuxt),
crie um controller no servidor (bff) que vai chamar o gateway para montar a mensagem
de retorno. Crie uma store em app/store que armazena os valores vindos do bff.
Sempre aplique os conceitos do SOLID, principalmente o Single Responsibility Principle, para que cada arquivo tenha uma unica responsabilidade.
Use vee validate para criar formularios, junto com zod.
Crie subrotas para criar e atualizar os itens do crud (/create e /:id). Crie um componente de formulario que possa ser usado pelos dois.
Na listagem de itens, use o componente ZampDataTable
Aplique os melhores padroes de design nos componentes
Separe os componentes das rotas criadas na pasta components da rota, ou seja, se criar /create criar a pasta create e components dentro
