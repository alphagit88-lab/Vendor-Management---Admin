import Image, { type ImageProps } from 'next/image';
import { isBackendUpload, resolveMediaUrl } from '@/lib/config';

type MediaImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

export function MediaImage({ src, ...props }: MediaImageProps) {
  return (
    <Image
      src={resolveMediaUrl(src)}
      unoptimized={isBackendUpload(src)}
      {...props}
    />
  );
}
