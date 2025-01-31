import {
    EnumGalleryItemType,
    GalleryItemType,
    IGallerySource,
    IGalleryItem,
} from '../../models';
import { show } from '../helpers/modal';
import { getYoutubeId, getVimeoId, getEmbedThumb } from './helpers/vendor';

const embedUrlFieldId: string = 'embedUrl';
const titleFieldId: string = 'title';
const thumbnailUrlFieldId: string = 'thumbnailUrl';
const body: string = `<fieldset class="form-group">
    <label for="${embedUrlFieldId}">URL</label>
    <input type="text" id="${embedUrlFieldId}" name="${embedUrlFieldId}" class="form-control">
    <p class="hint">URL to video on <a href="https://vimeo.com">Vimeo</a> or <a href="https://youtube.com">YouTube</a> (e.g. https://www.youtube.com/watch?v=TorVk3Hxm7Q).</p>
</fieldset><fieldset class="form-group">
<label for="${titleFieldId}">Title</label>
<input type="text" id="${titleFieldId}" name="${titleFieldId}" class="form-control">
<p class="hint">Provide a title for this video</p>
</fieldset><fieldset class="form-group">
<label for="${thumbnailUrlFieldId}">Thumbnail URL</label>
<input type="text" id="${thumbnailUrlFieldId}" name="${thumbnailUrlFieldId}" class="form-control">
<p class="hint">URL for a video thumbnail (if one is not provided, a default will be used from either Vimeo or YouTube respectively)</p>
</fieldset>`;

const description: string =
    'Add video by specifying URL to embed from third party sites (e.g. YouTube)';

const label: string = 'Add via Video Embed URL';

const invalidUrlMessage: string = 'Please enter a valid YouTube/Vimeo URL';

export default (id: string): IGallerySource => {
    return {
        description,
        label,
        action: (onAdd: (items: IGalleryItem[]) => void) => {
            const modalElement = document.querySelector(`.gallery > .${id}-ModalBody`) as Element;

            show(modalElement, {
                body,
                label,
                onComplete: (): Promise<boolean> => {
                    return new Promise((resolve) => {
                        const urlElement = document.getElementById(`${embedUrlFieldId}`) as HTMLInputElement;
                        const url = urlElement?.value as string;

                        const titleElement = document.getElementById(`${titleFieldId}`) as HTMLInputElement;
                        const title = titleElement?.value as string;

                        const thumbnailUrlElement = document.getElementById(thumbnailUrlFieldId) as HTMLInputElement;
                        const thumbnailUrl = thumbnailUrlElement?.value as string;

                        if (!getYoutubeId(url) && !getVimeoId(url)) {
                            alert(invalidUrlMessage);
                            resolve(false);
                            return;
                        }

                        getEmbedThumb(url)
                            .then((thumb: string) => {
                                onAdd([
                                    {
                                        type: EnumGalleryItemType.Video,
                                        typeName: GalleryItemType.getName(
                                            EnumGalleryItemType.Video
                                        ),
                                        thumb: thumbnailUrl || thumb,
                                        title,
                                        url,
                                    },
                                ]);

                                resolve(true);
                            })
                            .catch((error) => {
                                resolve(false);
                            });
                    });
                },
            });
        },
    };
};
