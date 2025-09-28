import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.8,
  stroke: "currentColor"
};

// FIX: Destructure base props to separate className for easier merging.
const { className: baseIconClassName, ...baseIconProps } = iconProps;

// FIX: Update all icon components to accept SVG props and merge classNames.
export const HomeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
);

export const SearchIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
);

export const PlusCircleIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

export const PlusIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);

export const ReelsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>
);

export const ProfileIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
);

export const HeartIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);

export const HeartIconFilled = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} fill="currentColor" stroke="currentColor" className={['text-red-500', baseIconClassName, className].filter(Boolean).join(' ')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export const CommentIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12s4.03 8.25 9 8.25Z" /></svg>
);

export const SendIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
);

export const BookmarkIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
);

export const ArrowLeftIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
);

export const SparklesIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={['w-5 h-5', baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
);

export const LoadingSpinner = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} className={['animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500', className].filter(Boolean).join(' ')} xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const GridIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25v2.25A2.25 2.25 0 0 1 8.25 20.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25h2.25a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
    </svg>
);

export const TaggedIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593,3.322c1.1,0.128,1.907,1.077,1.907,2.185v12.5l-7.5-3.75l-7.5,3.75V5.507c0-1.108,0.806-2.057,1.907-2.185 M12,12 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,12,12,12z M17,17H7c-1.657,0-3-1.343-3-3v0" />
    </svg>
);

export const AddIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);

export const MenuIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const CloseIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const CameraIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
);

export const MusicNoteIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9c0-1.152.26-2.24.72-3.221M9 9S6.75 7.5 4.5 7.5m4.5 1.5c-1.152 0-2.24.26-3.221.72M4.5 7.5c-2.25 0-4.5.75-4.5 3s2.25 3 4.5 3m4.5-4.5v6.375c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V9.375m0-3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5Z" /></svg>
);

export const CheckIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

export const EditProfileIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

export const ThemeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const AccountSwitchIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

export const LogOutIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg {...baseIconProps} {...props} className={[baseIconClassName, className].filter(Boolean).join(' ')}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);
