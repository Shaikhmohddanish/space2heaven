import { InputProps } from "@/types";

const Input = ({ title, name, value, placeholder = "", type, onChange }: InputProps) => {
    return (
        <div className="mb-4 w-full">
            <label htmlFor={name} className="block font-medium mb-1">
                {title}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="input-class"
                placeholder={placeholder}
                required
            />
        </div>
    );
};

export default Input;
