import React from "react";
interface ImportComponentProps {
    name: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function ImportComponent(props: ImportComponentProps){
    return (
        <div className={'import-component-container'}>
            <label htmlFor={props.name}>{props.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}</label>
            <input type="text" name={props.name} value={props.value} onChange={props.onChange} />
        </div>

    )
}