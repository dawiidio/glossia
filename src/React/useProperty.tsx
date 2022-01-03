import { useContext, useEffect, useMemo, useState } from 'react';
import { GlossiaReactContext } from './GlossiaContextProvider';
import { IProperty } from '../../types/IProperty';
import { IVariant } from '../../types/IVariant';
import { IVariantsMap } from '../../types/IVariantsMap';

export function useProperty<T extends IVariantsMap>(property: IProperty<T>): [string, ((newValue: string|number|IVariant) => void)] {
    const ctx = useContext(GlossiaReactContext);
    const [value, setValue] = useState<string>(() => {
        return ctx.getPropertyValue(property);
    });

    const setPropertyValue = useMemo(() => (newValue: string|number|IVariant) => {
        ctx.setPropertyValue(property, newValue);
    }, [ctx, property]);

    useEffect(() => ctx.watchProperty(property, setValue), [ctx, property]);

    return [
        value,
        setPropertyValue
    ]
}
