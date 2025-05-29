
import React from 'react';

export const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.595.341 4.858 3.975 2.934 1.826-4.402L10 13.39l.337 1.009 1.826 4.402 3.975-2.934.341-4.858-3.423-3.595-4.753-.39-1.83-4.401Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.13 8.13a.75.75 0 0 0-1.06-1.06L3.75 9.39V7.5a.75.75 0 0 0-1.5 0v3.38A.773.773 0 0 0 3 11.61l2.32-2.322.01-.008.002-.001ZM9.87 12.87a.75.75 0 0 0 1.06 1.06l2.32-2.32V14.25a.75.75 0 0 0 1.5 0V10.87A.773.773 0 0 0 14 10.14l-2.32 2.322-.01.008-.002.001Z" clipRule="evenodd" />
  </svg>
);

export const ExclamationTriangleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
  </svg>
);

export const LightBulbIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.355a7.5 7.5 0 0 1-3 0m3 0a7.5 7.5 0 0 0-3 0m.375 0a6.04 6.04 0 0 1-3.375 0m6.375 0a6.04 6.04 0 0 0-3.375 0m.375 2.355a7.5 7.5 0 0 1-.625 1.125M12 6.75M12 3.75m0 3A3.375 3.375 0 0 0 8.625 4.5a3.375 3.375 0 0 0-3.375 3.375M12 3.75c0 .966-.253 1.866-.688 2.625m2.063-2.625a3.375 3.375 0 0 1 3.375 3.375m0 0a3.375 3.375 0 0 1-3.375 3.375m0 0a3.375 3.375 0 0 0 3.375 3.375M12 6.75C9.312 6.75 7.5 8.562 7.5 11.25m0 0c0 .966.253 1.866.688 2.625M12 18.75c.966 0 1.866-.253 2.625-.688m-2.625.688A3.375 3.375 0 0 1 8.625 18a3.375 3.375 0 0 1 3.375-3.375m0 0c.966 0 1.866.253 2.625.688M12 3.75a3.375 3.375 0 0 0-3.375 3.375M12 6.75c2.688 0 4.5 1.812 4.5 4.5m-.375 6.375a6.04 6.04 0 0 1-3.375 0M12 18.75c-.966 0-1.866-.253-2.625-.688m2.625.688a3.375 3.375 0 0 0 3.375-3.375m0 0c-.966 0-1.866.253-2.625-.688M12 18.75a3.375 3.375 0 0 1-3.375-3.375" />
  </svg>
);

export const TagIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);

export const BuildingOfficeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375H9a.375.375 0 0 1-.375-.375v-1.5A.375.375 0 0 1 9 6.75ZM9 12.75h6.375a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375H9a.375.375 0 0 1-.375-.375v-1.5a.375.375 0 0 1 .375-.375ZM9 18.75h6.375a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375H9a.375.375 0 0 1-.375-.375v-1.5a.375.375 0 0 1 .375-.375Z" />
  </svg>
);

export const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m8.058 0a12.025 12.025 0 0 1-4.087.575c-1.053 0-2.062-.18-3-.51m6.75 0a.75.75 0 0 0-.75-.75H12a.75.75 0 0 0-.75.75m3.75 0a.75.75 0 0 0-.75-.75H12a.75.75 0 0 0-.75.75M12 12.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
  </svg>
);

export const ChatBubbleLeftEllipsisIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12 7.611 3.75 12.375 3.75 21 7.444 21 12Z" />
  </svg>
);

export const PencilSquareIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const PaintBrushIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.44-2.445c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.39m3.421 3.42a15.995 15.995 0 0 0 1.622-3.39m3.79 3.79a15.995 15.995 0 0 0 3.388-1.62m0-3.742a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.44-2.445c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0-3.39-1.62m5.043-.025a15.994 15.994 0 0 1-1.622-3.39M3.75 12h.008v.008H3.75V12Zm3.75 0h.008v.008H7.5V12Zm3.75 0h.008v.008H11.25V12Zm3.75 0h.008v.008H15V12Zm3.75 0h.008v.008H18.75V12Z" />
  </svg>
);

export const GiftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.032a9.018 9.018 0 0 1 6.173 2.386 9.052 9.052 0 0 1 2.386 6.173C21.29 17.48 17.478 21 12 21c-5.478 0-9.29-3.52-9.313-9.409A9.052 9.052 0 0 1 5.072 5.418 9.018 9.018 0 0 1 11.245 3.032 3.001 3.001 0 0 1 12.75 3.032ZM12 9.75V3M7.5 9.75A2.25 2.25 0 0 0 9.75 12h4.5A2.25 2.25 0 0 0 16.5 9.75M7.5 9.75h9" />
  </svg>
);

export const SwatchIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.032a9.018 9.018 0 0 1 6.173 2.386 9.052 9.052 0 0 1 2.386 6.173C21.29 17.48 17.478 21 12 21c-5.478 0-9.29-3.52-9.313-9.409A9.052 9.052 0 0 1 5.072 5.418 9.018 9.018 0 0 1 11.245 3.032 3.001 3.001 0 0 1 12.75 3.032ZM6.002 12.004a5.97 5.97 0 0 1 10.023-4.236l.002.001.002.001a5.97 5.97 0 0 1 3.586 3.572l.002.002.001.002a5.97 5.97 0 0 1-4.236 10.023l-.001-.002-.002-.002a5.97 5.97 0 0 1-3.572-3.586l-.002-.002-.002-.001a5.97 5.97 0 0 1-.003-2.329Z" />
  </svg>
);

export const ClipboardDocumentIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChevronUpIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

export const CommandLineIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export const KeyIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
  </svg>
);

export const CogIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0 0 4.5 12H3m18 0h-1.5m-1.5-1.5a7.5 7.5 0 0 0-11.964-5.474A7.5 7.5 0 0 0 4.504 12M3 12a7.5 7.5 0 0 0 4.464 6.974A7.5 7.5 0 0 0 19.5 12h1.5M12 4.5v.01M12 19.5v.01M4.5 12a7.5 7.5 0 0 1 .974-3.536A7.5 7.5 0 0 1 12 4.5v.01M19.5 12a7.5 7.5 0 0 1-.974 3.536A7.5 7.5 0 0 1 12 19.5v.01M12 4.5a7.5 7.5 0 0 0-7.464 6.974M12 19.5a7.5 7.5 0 0 0 7.464-6.974M4.504 12A7.5 7.5 0 0 1 12 4.5M19.536 12A7.5 7.5 0 0 1 12 19.5" />
  </svg>
);

interface IconProps {
  className?: string;
  title?: string;
}

export const CheckCircleIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"} aria-label={title}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"} aria-label={title}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const InformationCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>
);

export const CodeBracketSquareIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);

export const CodeBracketIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

export const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
