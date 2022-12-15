// const vcardsFormEndpointUrl ='https://hook.eu1.make.com/mm7yxxotvy89ju6tdy6fghlr59im5nhw'
const STAGINGvcardsFormEndpointUrl ='https://hook.eu1.make.com/oi6t5nrbumo9rzo41sx78v2q74e1lb6k'

export async function onRequestPost(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    return await fetch(
        STAGINGvcardsFormEndpointUrl,
        {
            method: "POST",
            body: await request.formData(),
        }
    );
}
