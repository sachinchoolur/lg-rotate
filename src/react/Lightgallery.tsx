import * as React from 'react';

//import { Zoom } from 'lightGallery/src/plugins/zoom/lg-zoom';

import { LightGallerySettings } from '../lg-settings';
import { LightGallery } from '../lightgallery';

export interface LightGalleryProps extends Partial<LightGallerySettings> {
    className?: string;
    children?: any;
}

const LG: React.FC<LightGalleryProps> = ({
    className,
    children,
    ...restProps
}: LightGalleryProps) => {
    const $lg = React.useRef(null);
    console.log(restProps);
    //console.log(Zoom);
    React.useEffect(() => {
        const lightGallery = new LightGallery(
            ($lg.current as unknown) as HTMLElement,
            restProps,
        );
        return function cleanup() {
            lightGallery.destroy();
        };
    }, []);

    return (
        <div ref={$lg} className={className}>
            {children}
        </div>
    );
};
export default LG;
