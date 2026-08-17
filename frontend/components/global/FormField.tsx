interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormField({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    value,
    onChange,
}: FormFieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block font-body text-sm font-semibold text-charcoal"
            >
                {label}
                {required && <span className="ml-1 text-orange">*</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="h-12 w-full rounded-[10px] border border-stone bg-white px-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text/40 focus:border-orange focus:ring-1 focus:ring-orange"
            />
        </div>
    );
}

export default FormField;