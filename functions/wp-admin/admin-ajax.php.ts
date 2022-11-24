const vcardsFormEndpointUrl = 'https://hook.eu1.make.com/ajvlslls80q6b9bb5fg2dyic4qdta55y';

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
        vcardsFormEndpointUrl,
        {
            method: "POST",
            body: await request.formData(),
        }
    );
}
