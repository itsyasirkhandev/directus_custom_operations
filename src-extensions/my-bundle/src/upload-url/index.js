import { get } from 'lodash';

export default (router, { services, getSchema }) => {
    const { FilesService } = services;

    router.post('/', async (req, res, next) => {
        const accountability = req.accountability;

        if (!req.body.url) {
            return res.status(400).json({ error: 'The "url" property is required in the request body.' });
        }

        const fileUrl = req.body.url;
        const folderId = req.body.folder || null;
        const title = req.body.title || null;
        const description = req.body.description || null;

        try {
            const filesService = new FilesService({
                accountability: accountability,
                schema: await getSchema(),
            });

            // The importOne method is specifically designed for this!
            const fileId = await filesService.importOne(fileUrl, {
                folder: folderId,
                title: title,
                description: description,
            });

            const newFile = await filesService.readOne(fileId);

            return res.status(200).json(newFile);

        } catch (error) {
            console.error('File import failed:', error);
            return next(error);
        }
    });
};